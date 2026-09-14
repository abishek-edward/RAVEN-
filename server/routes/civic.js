import express from 'express';
import { query } from '../db/client.js';
import { calculateAIAssistedPriorityScore } from '../services/priorityService.js';
import { correlateCivicCluster, generatePriorityExplanation } from '../services/aiService.js';

const router = express.Router();

// Helper to format civic cluster row
function formatCluster(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    department: row.department,
    officialChannelKey: row.official_channel_key,
    location: row.location,
    district: row.district,
    coordinates: [row.latitude || 13.0827, row.longitude || 80.2707],
    reportsCount: row.reports_count,
    confirmationsCount: row.confirmations_count,
    evidenceCount: row.evidence_count,
    affectedLocations: row.affected_locations || [],
    severity: row.severity,
    durationDays: row.duration_days,
    publicSupportScore: row.public_support_score,
    aiPriorityData: row.ai_priority_data || {},
    status: row.status,
    firstReportedDate: row.first_reported_date ? new Date(row.first_reported_date).toISOString().split('T')[0] : null,
    lastReportedDate: row.last_reported_date ? new Date(row.last_reported_date).toISOString().split('T')[0] : null,
    trustLabel: row.trust_label || 'ANALYSIS',
    aiSummary: row.ai_summary,
    commonKeywords: row.common_keywords || [],
    relevantOfficialChannels: row.relevant_official_channels || {},
    grievanceStatus: row.grievance_status || 'Under Monitoring',
    officialResponse: row.official_response
  };
}

// Helper to format civic report row
function formatCivicReport(row) {
  return {
    id: row.id,
    clusterId: row.cluster_id,
    userId: row.user_id,
    text: row.text,
    language: row.language,
    location: row.location,
    district: row.district,
    category: row.category,
    subIssue: row.sub_issue,
    reportedBy: row.reported_by,
    isAnonymous: row.is_anonymous,
    date: row.date ? new Date(row.date).toISOString().split('T')[0] : null,
    attachments: row.attachments || [],
    hasPhoto: row.has_photo,
    photoUrl: row.photo_url,
    durationDays: row.duration_days,
    status: row.status,
    createdAt: row.created_at
  };
}

// 1. GET /api/civic/clusters — Fetch all clusters
router.get('/clusters', async (req, res) => {
  try {
    const result = await query('SELECT * FROM issue_clusters ORDER BY reports_count DESC');
    res.json(result.rows.map(formatCluster));
  } catch (err) {
    console.error('Error fetching civic clusters:', err);
    res.status(500).json({ error: 'Failed to retrieve civic clusters' });
  }
});

// 2. GET /api/civic/reports — Fetch all reports
router.get('/reports', async (req, res) => {
  try {
    const result = await query('SELECT * FROM issue_reports ORDER BY created_at DESC');
    res.json(result.rows.map(formatCivicReport));
  } catch (err) {
    console.error('Error fetching civic reports:', err);
    res.status(500).json({ error: 'Failed to retrieve civic reports' });
  }
});

// 3. GET /api/civic/clusters/:id — Single cluster with reports
router.get('/clusters/:id', async (req, res) => {
  try {
    const clusterRes = await query('SELECT * FROM issue_clusters WHERE id = $1', [req.params.id]);
    if (clusterRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cluster not found' });
    }
    const cluster = formatCluster(clusterRes.rows[0]);

    const reportsRes = await query(
      'SELECT * FROM issue_reports WHERE cluster_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    const reports = reportsRes.rows.map(formatCivicReport);

    res.json({ cluster, reports });
  } catch (err) {
    console.error('Error fetching cluster details:', err);
    res.status(500).json({ error: 'Failed to retrieve cluster' });
  }
});

// 4. POST /api/civic/reports — Submit Civic Issue Report
router.post('/reports', async (req, res) => {
  const {
    text,
    category,
    location,
    district,
    durationDays,
    attachments = [],
    userId = 'demo-citizen-01',
    language = 'English'
  } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Report text is required' });
  }

  const reportId = `CR-${Date.now().toString().slice(-4)}`;
  const attachmentList = Array.isArray(attachments) ? attachments : [];
  const imageAttachment = attachmentList.find(a => a.type?.startsWith('image/') || a.previewUrl);
  const parsedDuration = parseInt(durationDays, 10) || 7;
  const userDistrict = district || 'Chennai';
  const userLocation = location || `${userDistrict} Local Area`;

  try {
    // 1. Fetch existing clusters to find correlation
    const existingClustersRes = await query('SELECT * FROM issue_clusters');
    const existingClusters = existingClustersRes.rows.map(formatCluster);

    const correlationResult = await correlateCivicCluster({
      text: text.trim(),
      category,
      location: userLocation,
      district: userDistrict,
      durationDays: parsedDuration,
      attachments: attachmentList
    }, existingClusters);

    let targetCluster = null;

    if (!correlationResult.isNewCluster) {
      // Correlate with existing cluster
      const matched = correlationResult.cluster;
      const newReportCount = matched.reportsCount + 1;
      const newEvidenceCount = matched.evidenceCount + attachmentList.length;
      const newDuration = Math.max(matched.durationDays, parsedDuration);
      
      const locationsSet = new Set(matched.affectedLocations || []);
      locationsSet.add(userLocation);
      const updatedLocations = Array.from(locationsSet);

      // STRICT DETERMINISTIC PRIORITY SCORE (30 / 25 / 20 / 15 / 10)
      const newAiScore = calculateAIAssistedPriorityScore({
        reportCount: newReportCount,
        severityLevel: matched.severity || 'Medium',
        durationDays: newDuration,
        affectedLocationsCount: updatedLocations.length,
        evidenceCount: newEvidenceCount
      });

      const updateSql = `
        UPDATE issue_clusters SET
          reports_count = $1,
          evidence_count = $2,
          duration_days = $3,
          affected_locations = $4,
          ai_priority_data = $5,
          last_reported_date = CURRENT_DATE
        WHERE id = $6
        RETURNING *
      `;
      const updateRes = await query(updateSql, [
        newReportCount,
        newEvidenceCount,
        newDuration,
        JSON.stringify(updatedLocations),
        JSON.stringify(newAiScore),
        matched.id
      ]);

      targetCluster = formatCluster(updateRes.rows[0]);
    } else {
      // Create new cluster proposal
      const cData = correlationResult.clusterData;

      // Calculate initial deterministic priority score
      const initialAiScore = calculateAIAssistedPriorityScore({
        reportCount: 1,
        severityLevel: 'Medium',
        durationDays: parsedDuration,
        affectedLocationsCount: 1,
        evidenceCount: attachmentList.length
      });
      cData.aiPriorityData = initialAiScore;

      const insertClusterSql = `
        INSERT INTO issue_clusters (
          id, title, category, department, official_channel_key,
          location, district, latitude, longitude, reports_count,
          confirmations_count, evidence_count, affected_locations,
          severity, duration_days, public_support_score, ai_priority_data,
          status, first_reported_date, last_reported_date, trust_label,
          ai_summary, common_keywords, relevant_official_channels,
          grievance_status, official_response
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        RETURNING *
      `;
      const clusterRes = await query(insertClusterSql, [
        cData.id,
        cData.title,
        cData.category,
        cData.department,
        cData.officialChannelKey,
        cData.location,
        cData.district,
        cData.latitude,
        cData.longitude,
        cData.reportsCount,
        cData.confirmationsCount,
        cData.evidenceCount,
        JSON.stringify(cData.affectedLocations),
        cData.severity,
        cData.durationDays,
        cData.publicSupportScore,
        JSON.stringify(cData.aiPriorityData),
        cData.status,
        cData.firstReportedDate,
        cData.lastReportedDate,
        cData.trustLabel,
        cData.aiSummary,
        JSON.stringify(cData.commonKeywords),
        JSON.stringify(cData.relevantOfficialChannels),
        cData.grievanceStatus,
        cData.officialResponse
      ]);

      targetCluster = formatCluster(clusterRes.rows[0]);
    }

    // 2. Insert issue report referencing target cluster
    const insertReportSql = `
      INSERT INTO issue_reports (
        id, cluster_id, user_id, text, language,
        location, district, category, sub_issue,
        reported_by, is_anonymous, date, attachments,
        has_photo, photo_url, duration_days, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE, $12, $13, $14, $15, 'Citizen-Reported')
      RETURNING *
    `;

    const reportRes = await query(insertReportSql, [
      reportId,
      targetCluster.id,
      userId,
      text.trim(),
      language,
      userLocation,
      userDistrict,
      category,
      category,
      'Anonymous Citizen',
      true,
      JSON.stringify(attachmentList),
      Boolean(imageAttachment),
      imageAttachment?.previewUrl || null,
      parsedDuration
    ]);

    const createdReport = formatCivicReport(reportRes.rows[0]);

    res.status(201).json({
      report: createdReport,
      cluster: targetCluster
    });
  } catch (err) {
    console.error('Error submitting civic report:', err);
    res.status(500).json({ error: 'Failed to persist civic report in database' });
  }
});

// 5. POST /api/civic/clusters/:id/support — Support/Upvote cluster
router.post('/clusters/:id/support', async (req, res) => {
  const clusterId = req.params.id;
  try {
    const updateRes = await query(
      `UPDATE issue_clusters
       SET public_support_score = LEAST(100, public_support_score + 1)
       WHERE id = $1
       RETURNING *`,
      [clusterId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cluster not found' });
    }

    res.json(formatCluster(updateRes.rows[0]));
  } catch (err) {
    console.error('Error supporting cluster:', err);
    res.status(500).json({ error: 'Failed to record support vote' });
  }
});

// 6. POST /api/civic/clusters/:id/analyze — Run AI Priority Explanation
router.post('/clusters/:id/analyze', async (req, res) => {
  const clusterId = req.params.id;
  try {
    const clusterRes = await query('SELECT * FROM issue_clusters WHERE id = $1', [clusterId]);
    if (clusterRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cluster not found' });
    }
    const cluster = formatCluster(clusterRes.rows[0]);

    // Recalculate deterministic score
    const priorityData = calculateAIAssistedPriorityScore({
      reportCount: cluster.reportsCount,
      severityLevel: cluster.severity,
      durationDays: cluster.durationDays,
      affectedLocationsCount: cluster.affectedLocations?.length || 1,
      evidenceCount: cluster.evidenceCount
    });

    // Generate natural language explanation using Claude AI
    const naturalExplanation = await generatePriorityExplanation(priorityData, cluster);
    priorityData.explanation = naturalExplanation;

    const updateRes = await query(
      `UPDATE issue_clusters
       SET ai_priority_data = $1
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(priorityData), clusterId]
    );

    res.json(formatCluster(updateRes.rows[0]));
  } catch (err) {
    console.error('Error generating AI explanation for cluster:', err);
    res.status(500).json({ error: 'Failed to generate AI explanation' });
  }
});

export default router;
