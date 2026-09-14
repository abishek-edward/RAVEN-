import express from 'express';
import { query } from '../db/client.js';
import { analyzeSchemeGap } from '../services/aiService.js';

const router = express.Router();

// Helper to map DB row to frontend scheme object
function formatScheme(row) {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    department: row.department,
    location: row.location,
    category: row.category,
    officialStatus: row.official_status,
    trustLabel: row.trust_label,
    isDemoRecord: row.is_demo_record,
    officialSource: row.official_source || {},
    objective: row.objective,
    benefit: row.benefit,
    eligibility: row.eligibility,
    requiredDocuments: row.required_documents || [],
    applicationProcess: row.application_process,
    timeline: row.timeline,
    simpleEnglishExplanation: row.simple_english_explanation,
    simpleTamilExplanation: row.simple_tamil_explanation,
    officialChannelKey: row.official_channel_key,
    officialResponse: row.official_response
  };
}

// Helper to format scheme report row
function formatSchemeReport(row) {
  return {
    id: row.id,
    schemeId: row.scheme_id,
    userId: row.user_id,
    citizenName: row.citizen_name,
    isAnonymous: row.is_anonymous,
    district: row.district,
    college: row.college,
    locationDetail: row.location_detail,
    category: row.category,
    language: row.language,
    reportText: row.report_text,
    delayDays: row.delay_days,
    attachments: row.attachments || [],
    evidenceCount: row.evidence_count,
    evidenceType: row.evidence_type,
    status: row.status,
    dateReported: row.date_reported ? new Date(row.date_reported).toISOString().split('T')[0] : null,
    upvotes: row.upvotes,
    createdAt: row.created_at
  };
}

// Helper to format scheme cluster / gap analysis row
function formatSchemeAnalysis(row) {
  return {
    schemeId: row.scheme_id,
    totalCitizenReports: row.total_citizen_reports,
    evidenceCount: row.evidence_count,
    reportedDistricts: row.reported_districts || [],
    breakdown: row.breakdown || [],
    platformSummary: row.platform_summary,
    averageDelayDays: row.average_delay_days,
    implementationGapStatus: row.implementation_gap_status,
    officialResponse: row.official_response,
    lastAnalyzedAt: row.last_analyzed_at
  };
}

// 1. GET /api/schemes — List all schemes
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM schemes ORDER BY id ASC');
    const schemes = result.rows.map(formatScheme);
    res.json(schemes);
  } catch (err) {
    console.error('Error fetching schemes:', err);
    res.status(500).json({ error: 'Failed to retrieve schemes from database' });
  }
});

// 2. GET /api/scheme-reports — List all scheme reports across all schemes
router.get('/reports/all', async (req, res) => {
  try {
    const result = await query('SELECT * FROM scheme_reports ORDER BY created_at DESC');
    res.json(result.rows.map(formatSchemeReport));
  } catch (err) {
    console.error('Error fetching all scheme reports:', err);
    res.status(500).json({ error: 'Failed to retrieve scheme reports' });
  }
});

// 3. GET /api/scheme-analysis — Map of all scheme analyses
router.get('/analysis/all', async (req, res) => {
  try {
    const result = await query('SELECT * FROM scheme_clusters');
    const analysisMap = {};
    result.rows.forEach(r => {
      analysisMap[r.scheme_id] = formatSchemeAnalysis(r);
    });
    res.json(analysisMap);
  } catch (err) {
    console.error('Error fetching all scheme analysis:', err);
    res.status(500).json({ error: 'Failed to retrieve scheme analyses' });
  }
});

// 4. GET /api/schemes/:id — Single scheme
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM schemes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json(formatScheme(result.rows[0]));
  } catch (err) {
    console.error('Error fetching scheme:', err);
    res.status(500).json({ error: 'Failed to retrieve scheme' });
  }
});

// 5. GET /api/schemes/:id/reports — Reports for specific scheme
router.get('/:id/reports', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM scheme_reports WHERE scheme_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(result.rows.map(formatSchemeReport));
  } catch (err) {
    console.error('Error fetching scheme reports:', err);
    res.status(500).json({ error: 'Failed to retrieve scheme reports' });
  }
});

// 6. POST /api/schemes/:id/reports — Submit Citizen Scheme Report
router.post('/:id/reports', async (req, res) => {
  const schemeId = req.params.id;
  const {
    reportText,
    category,
    college,
    delayDays,
    attachments = [],
    evidenceType,
    userId,
    citizenName,
    district,
    language = 'English'
  } = req.body;

  if (!reportText || !reportText.trim()) {
    return res.status(400).json({ error: 'Report text is required' });
  }

  const reportId = `SR-${Date.now().toString().slice(-4)}`;
  const parsedDelay = delayDays !== undefined && delayDays !== null && !isNaN(parseInt(delayDays, 10))
    ? parseInt(delayDays, 10)
    : null;
  const attachmentList = Array.isArray(attachments) ? attachments : [];
  const evidenceCount = attachmentList.length > 0 ? attachmentList.length : (evidenceType ? 1 : 0);

  try {
    // 1. Insert report into Supabase
    const insertSql = `
      INSERT INTO scheme_reports (
        id, scheme_id, user_id, citizen_name, is_anonymous,
        district, college, category, language, report_text,
        delay_days, attachments, evidence_count, evidence_type,
        status, date_reported, upvotes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_DATE, 1)
      RETURNING *
    `;

    const insertRes = await query(insertSql, [
      reportId,
      schemeId,
      userId || 'demo-citizen-01',
      citizenName || 'Anonymous Citizen',
      true,
      district || 'Chennai',
      college || null,
      category || 'General Implementation Observation',
      language,
      reportText.trim(),
      parsedDelay,
      JSON.stringify(attachmentList),
      evidenceCount,
      evidenceType || (attachmentList.length > 0 ? 'Citizen-Provided Evidence' : 'Citizen testimony'),
      'Citizen-Reported'
    ]);

    const createdReport = formatSchemeReport(insertRes.rows[0]);

    // 2. Fetch all reports for this scheme to dynamically recompute statistics & gap
    const allReportsRes = await query(
      'SELECT * FROM scheme_reports WHERE scheme_id = $1',
      [schemeId]
    );
    const allReports = allReportsRes.rows.map(formatSchemeReport);

    const schemeRes = await query('SELECT * FROM schemes WHERE id = $1', [schemeId]);
    const scheme = schemeRes.rows.length > 0 ? formatScheme(schemeRes.rows[0]) : { id: schemeId, name: schemeId };

    // 3. Run AI or heuristic gap analysis synthesis
    const updatedAnalysis = await analyzeSchemeGap(scheme, allReports);

    // 4. Update or insert into scheme_clusters table
    await query(
      `INSERT INTO scheme_clusters (
        id, scheme_id, total_citizen_reports, evidence_count,
        reported_districts, breakdown, platform_summary,
        average_delay_days, implementation_gap_status, official_response, last_analyzed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (scheme_id) DO UPDATE SET
        total_citizen_reports = EXCLUDED.total_citizen_reports,
        evidence_count = EXCLUDED.evidence_count,
        reported_districts = EXCLUDED.reported_districts,
        breakdown = EXCLUDED.breakdown,
        platform_summary = EXCLUDED.platform_summary,
        average_delay_days = EXCLUDED.average_delay_days,
        implementation_gap_status = EXCLUDED.implementation_gap_status,
        last_analyzed_at = NOW()`,
      [
        `SC-${schemeId}`,
        schemeId,
        updatedAnalysis.totalCitizenReports,
        updatedAnalysis.evidenceCount,
        JSON.stringify(updatedAnalysis.reportedDistricts),
        JSON.stringify(updatedAnalysis.breakdown),
        updatedAnalysis.platformSummary,
        updatedAnalysis.averageDelayDays,
        updatedAnalysis.implementationGapStatus,
        scheme.officialResponse || null
      ]
    );

    res.status(201).json({
      report: createdReport,
      analysis: updatedAnalysis
    });
  } catch (err) {
    console.error('Error submitting scheme report:', err);
    res.status(500).json({ error: 'Failed to persist scheme report in database' });
  }
});

// 7. GET /api/schemes/:id/analysis — Fetch scheme analysis
router.get('/:id/analysis', async (req, res) => {
  const schemeId = req.params.id;
  try {
    const result = await query(
      'SELECT * FROM scheme_clusters WHERE scheme_id = $1',
      [schemeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(formatSchemeAnalysis(result.rows[0]));
  } catch (err) {
    console.error('Error fetching scheme analysis:', err);
    res.status(500).json({ error: 'Failed to retrieve scheme analysis' });
  }
});

// 8. POST /api/schemes/:id/analyze — Trigger AI analysis
router.post('/:id/analyze', async (req, res) => {
  const schemeId = req.params.id;
  try {
    const schemeRes = await query('SELECT * FROM schemes WHERE id = $1', [schemeId]);
    if (schemeRes.rows.length === 0) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    const scheme = formatScheme(schemeRes.rows[0]);

    const reportsRes = await query(
      'SELECT * FROM scheme_reports WHERE scheme_id = $1',
      [schemeId]
    );
    const reports = reportsRes.rows.map(formatSchemeReport);

    const updatedAnalysis = await analyzeSchemeGap(scheme, reports);

    await query(
      `INSERT INTO scheme_clusters (
        id, scheme_id, total_citizen_reports, evidence_count,
        reported_districts, breakdown, platform_summary,
        average_delay_days, implementation_gap_status, official_response, last_analyzed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (scheme_id) DO UPDATE SET
        total_citizen_reports = EXCLUDED.total_citizen_reports,
        evidence_count = EXCLUDED.evidence_count,
        reported_districts = EXCLUDED.reported_districts,
        breakdown = EXCLUDED.breakdown,
        platform_summary = EXCLUDED.platform_summary,
        average_delay_days = EXCLUDED.average_delay_days,
        implementation_gap_status = EXCLUDED.implementation_gap_status,
        last_analyzed_at = NOW()`,
      [
        `SC-${schemeId}`,
        schemeId,
        updatedAnalysis.totalCitizenReports,
        updatedAnalysis.evidenceCount,
        JSON.stringify(updatedAnalysis.reportedDistricts),
        JSON.stringify(updatedAnalysis.breakdown),
        updatedAnalysis.platformSummary,
        updatedAnalysis.averageDelayDays,
        updatedAnalysis.implementationGapStatus,
        scheme.officialResponse || null
      ]
    );

    res.json(updatedAnalysis);
  } catch (err) {
    console.error('Error running AI analysis on scheme:', err);
    res.status(500).json({ error: 'Failed to run AI analysis' });
  }
});

export default router;
