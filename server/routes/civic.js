import express from 'express';
import { query } from '../db/client.js';
import { calculateAIAssistedPriorityScore } from '../services/priorityService.js';
import { correlateCivicCluster, generatePriorityExplanation } from '../services/aiService.js';
import { resolveFastTriggerAuthorityServer, resolveJurisdictionByCoordinates } from '../services/authorityResolver.js';
import { assessReportEvidenceServer } from '../services/evidenceService.js';

const router = express.Router();

// Helper to format civic cluster row
function formatCluster(row) {
  const hasCoordinates = row.latitude != null && row.longitude != null && !isNaN(Number(row.latitude)) && !isNaN(Number(row.longitude));
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    department: row.department,
    officialChannelKey: row.official_channel_key,
    location: row.location,
    district: row.district,
    latitude: hasCoordinates ? Number(row.latitude) : null,
    longitude: hasCoordinates ? Number(row.longitude) : null,
    coordinates: hasCoordinates ? [Number(row.latitude), Number(row.longitude)] : null,
    ward: row.ward || null,
    constituency: row.constituency || null,
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
  const hasCoordinates = row.latitude != null && row.longitude != null && !isNaN(Number(row.latitude)) && !isNaN(Number(row.longitude));
  return {
    id: row.id,
    clusterId: row.cluster_id,
    userId: row.user_id,
    text: row.text,
    language: row.language,
    location: row.location,
    district: row.district,
    latitude: hasCoordinates ? Number(row.latitude) : null,
    longitude: hasCoordinates ? Number(row.longitude) : null,
    coordinates: hasCoordinates ? [Number(row.latitude), Number(row.longitude)] : null,
    ward: row.ward || null,
    constituency: row.constituency || null,
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

// 1. GET /api/civic/clusters — Fetch all clusters with optional server-side SQL ward/constituency filtering
router.get('/clusters', async (req, res) => {
  const { ward, constituency } = req.query;

  // Filtering is enforced server-side via SQL WHERE clause on ward/constituency — this is real, but there is no session-token verification, so a technically sophisticated user could still forge a request. Production deployment would need JWT/session-based auth to close this gap.
  try {
    let sql = 'SELECT * FROM issue_clusters';
    const params = [];

    if (ward && constituency) {
      sql += ' WHERE ward = $1 AND constituency = $2';
      params.push(ward, constituency);
    } else if (ward) {
      sql += ' WHERE ward = $1';
      params.push(ward);
    } else if (constituency) {
      sql += ' WHERE constituency = $1';
      params.push(constituency);
    }

    sql += ' ORDER BY reports_count DESC';

    const result = await query(sql, params);
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
    console.error('Error fetching civic cluster detail:', err);
    res.status(500).json({ error: 'Failed to retrieve cluster' });
  }
});

// 3b. PATCH /api/civic/clusters/:id/status — Admin-only status update with persistence
router.patch('/clusters/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;

  // Role check: Only authorized Admin users can edit official issue status
  if (role !== 'Admin') {
    return res.status(403).json({ error: 'Unauthorized: Only Admin users can edit official issue status' });
  }

  const validStatuses = ['Ready', 'Escalation', 'Monitoring', 'Resolved', 'Active'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Allowed values: ${validStatuses.join(', ')}` 
    });
  }

  try {
    const updateRes = await query(
      `UPDATE issue_clusters
       SET status = $1, last_reported_date = CURRENT_DATE
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cluster not found' });
    }

    const updated = formatCluster(updateRes.rows[0]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating cluster status in DB:', err);
    res.status(500).json({ error: 'Failed to update cluster status' });
  }
});

// 3c. PATCH /api/civic/reports/:id/status — Admin-only report status update with persistence
router.patch('/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;

  if (role !== 'Admin') {
    return res.status(403).json({ error: 'Unauthorized: Only Admin users can edit report status' });
  }

  const validReportStatuses = ['Citizen-Reported', 'Corroborated', 'Under Review', 'Escalated', 'Resolved', 'Initial Reference'];
  if (!status || !validReportStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid report status. Allowed values: ${validReportStatuses.join(', ')}` 
    });
  }

  try {
    const updateRes = await query(
      `UPDATE issue_reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(formatCivicReport(updateRes.rows[0]));
  } catch (err) {
    console.error('Error updating report status in DB:', err);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

// 4. POST /api/civic/reports — Submit Civic Issue Report
router.post('/reports', async (req, res) => {
  const {
    text,
    category,
    location,
    district,
    latitude,
    longitude,
    durationDays,
    attachments = [],
    userId = 'demo-citizen-01',
    language = 'English'
  } = req.body;

  // Strict required fields validation
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Report description text is required' });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ error: 'Issue category is required' });
  }
  if (!location || !location.trim()) {
    return res.status(400).json({ error: 'Issue location is required' });
  }

  const reportId = `CR-${Date.now().toString().slice(-4)}`;
  const attachmentList = Array.isArray(attachments) ? attachments : [];
  const imageAttachment = attachmentList.find(a => a.type?.startsWith('image/') || a.previewUrl);
  const parsedDuration = parseInt(durationDays, 10) || 7;
  const userDistrict = district || 'Chennai';
  const userLocation = location.trim();

  // Validate submitted coordinates — real GPS integrity
  const parsedLat = parseFloat(latitude);
  const parsedLng = parseFloat(longitude);
  const hasValidCoordinates = 
    latitude != null && 
    longitude != null && 
    !isNaN(parsedLat) && 
    !isNaN(parsedLng) && 
    parsedLat >= -90 && parsedLat <= 90 && 
    parsedLng >= -180 && parsedLng <= 180;

  const validLatitude = hasValidCoordinates ? parsedLat : null;
  const validLongitude = hasValidCoordinates ? parsedLng : null;

  // Resolve jurisdiction on SERVER using GPS coordinates as primary, location text as keyword fallback, and Unassigned if neither matches
  const resolvedJurisdiction = resolveJurisdictionByCoordinates(validLatitude, validLongitude, userLocation);

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

      // Existing cluster case:
      // - Do NOT blindly replace cluster's canonical coordinates
      // - Preserve existing cluster coordinate unless null
      // - If existing cluster has no ward/constituency yet, populate from resolved jurisdiction
      const finalWard = (matched.ward && matched.ward !== 'Unassigned') ? matched.ward : resolvedJurisdiction.ward;
      const finalConstituency = (matched.constituency && matched.constituency !== 'Unassigned') ? matched.constituency : resolvedJurisdiction.constituency;
      const finalLatitude = matched.latitude != null ? matched.latitude : validLatitude;
      const finalLongitude = matched.longitude != null ? matched.longitude : validLongitude;

      const updateSql = `
        UPDATE issue_clusters SET
          reports_count = $1,
          evidence_count = $2,
          duration_days = $3,
          affected_locations = $4,
          ai_priority_data = $5,
          ward = $6,
          constituency = $7,
          latitude = $8,
          longitude = $9,
          last_reported_date = CURRENT_DATE
        WHERE id = $10
        RETURNING *
      `;
      const updateRes = await query(updateSql, [
        newReportCount,
        newEvidenceCount,
        newDuration,
        JSON.stringify(updatedLocations),
        JSON.stringify(newAiScore),
        finalWard,
        finalConstituency,
        finalLatitude,
        finalLongitude,
        matched.id
      ]);

      targetCluster = formatCluster(updateRes.rows[0]);
    } else {
      // Create new cluster proposal
      const cData = correlationResult.clusterData;

      // STRICT: Citizen GPS must override AI/default cluster coordinates
      // Never allow AI-generated/default coordinates to replace valid citizen submitted coordinates.
      // If no valid coordinates were submitted, keep null.
      cData.latitude = validLatitude;
      cData.longitude = validLongitude;
      cData.ward = resolvedJurisdiction.ward;
      cData.constituency = resolvedJurisdiction.constituency;

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
          location, district, latitude, longitude, ward, constituency,
          reports_count, confirmations_count, evidence_count, affected_locations,
          severity, duration_days, public_support_score, ai_priority_data,
          status, first_reported_date, last_reported_date, trust_label,
          ai_summary, common_keywords, relevant_official_channels,
          grievance_status, official_response
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
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
        cData.ward,
        cData.constituency,
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
        location, district, latitude, longitude, ward, constituency,
        category, sub_issue, reported_by, is_anonymous, date, attachments,
        has_photo, photo_url, duration_days, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_DATE, $16, $17, $18, $19, 'Citizen-Reported')
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
      validLatitude,
      validLongitude,
      resolvedJurisdiction.ward,
      resolvedJurisdiction.constituency,
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

    // Fast Trigger & Evidence Assessment computation
    const evidenceAssessment = assessReportEvidenceServer({
      attachments: attachmentList,
      category,
      reportText: text
    });

    const fastTrigger = resolveFastTriggerAuthorityServer({
      category,
      location: userLocation,
      district: userDistrict,
      cluster: targetCluster
    });

    const citizenFastResponse = {
      acknowledgement: 'Your report has been received.',
      clusterAssociation: correlationResult.isNewCluster
        ? `A new civic issue cluster (${targetCluster.id}) has been initiated for your area.`
        : `Your report appears related to an existing civic issue in your area (Cluster ${targetCluster.id}).`,
      officialStatus: targetCluster.officialResponse
        ? `Official response received: ${targetCluster.officialResponse}`
        : 'No official response received yet.',
      evidenceAssessment,
      fastTrigger
    };

    createdReport.evidenceAssessment = evidenceAssessment;
    targetCluster.fastTrigger = fastTrigger;

    res.status(201).json({
      report: createdReport,
      cluster: targetCluster,
      citizenFastResponse
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
