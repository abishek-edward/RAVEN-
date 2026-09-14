import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './client.js';

// Import existing initial datasets
import { INITIAL_SCHEMES } from '../../src/data/initialSchemes.js';
import { INITIAL_SCHEME_REPORTS, SCHEME_AGGREGATED_ANALYSIS } from '../../src/data/initialSchemeReports.js';
import { INITIAL_CIVIC_REPORTS, INITIAL_CIVIC_CLUSTERS } from '../../src/data/initialCivicIssues.js';
import { INITIAL_CONFIRMATIONS } from '../../src/data/initialConfirmations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrationsAndSeed() {
  console.log('🔄 [Migration] Starting Supabase schema deployment...');

  // 1. Read and apply schema.sql
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await query(schemaSql);
    console.log('✅ [Migration] PostgreSQL schema created/verified successfully.');
  } catch (err) {
    console.error('❌ [Migration] Error creating schema:', err.message);
    throw err;
  }

  // 2. Seed Profiles
  const profilesCountRes = await query('SELECT count(*) FROM profiles');
  if (parseInt(profilesCountRes.rows[0].count, 10) < 10) {
    console.log('🌱 [Seed] Seeding demo profiles...');
    const demoProfiles = [
      { id: 'demo-citizen-01', name: 'Demo Citizen', district: 'Chennai', role: 'Citizen', avatar: 'DC' },
      { id: 'demo-admin-01', name: 'RAVEN Demo Administrator', district: 'Statewide / TN', role: 'Admin', avatar: 'RA' },
      { id: 'demo-citizen-02', name: 'Citizen Madurai', district: 'Madurai', role: 'Citizen', avatar: 'CM' },
      { id: 'demo-citizen-03', name: 'Citizen Coimbatore', district: 'Coimbatore', role: 'Citizen', avatar: 'CC' },
      { id: 'demo-citizen-04', name: 'Citizen Salem', district: 'Salem', role: 'Citizen', avatar: 'CS' },
      { id: 'demo-citizen-05', name: 'Citizen Tiruchi', district: 'Tiruchirappalli', role: 'Citizen', avatar: 'CT' },
      { id: 'demo-citizen-06', name: 'Citizen Tirunelveli', district: 'Tirunelveli', role: 'Citizen', avatar: 'CN' },
      { id: 'demo-citizen-07', name: 'Citizen Vellore', district: 'Vellore', role: 'Citizen', avatar: 'CV' },
      { id: 'demo-citizen-08', name: 'Citizen Tiruvallur', district: 'Tiruvallur', role: 'Citizen', avatar: 'CT' },
      { id: 'demo-citizen-09', name: 'Citizen Kanchipuram', district: 'Kanchipuram', role: 'Citizen', avatar: 'CK' },
      { id: 'demo-citizen-10', name: 'Citizen Villupuram', district: 'Villupuram', role: 'Citizen', avatar: 'CV' }
    ];

    for (const p of demoProfiles) {
      await query(
        `INSERT INTO profiles (id, name, district, role, avatar)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.district, p.role, p.avatar]
      );
    }
    console.log(`✅ [Seed] ${demoProfiles.length} profiles verified.`);
  } else {
    console.log('ℹ️ [Seed] Profiles table already populated.');
  }

  // 3. Seed Schemes
  const schemesCountRes = await query('SELECT count(*) FROM schemes');
  if (parseInt(schemesCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding schemes...');
    for (const s of INITIAL_SCHEMES) {
      await query(
        `INSERT INTO schemes (
          id, name, short_name, department, location, category,
          official_status, trust_label, is_demo_record, official_source,
          objective, benefit, eligibility, required_documents,
          application_process, timeline, simple_english_explanation,
          simple_tamil_explanation, official_channel_key, official_response
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO NOTHING`,
        [
          s.id,
          s.name,
          s.shortName || s.name,
          s.department,
          s.location,
          s.category,
          s.officialStatus,
          s.trustLabel || 'OFFICIAL',
          Boolean(s.isDemoRecord),
          JSON.stringify(s.officialSource || {}),
          s.objective,
          s.benefit,
          s.eligibility,
          JSON.stringify(s.requiredDocuments || []),
          s.applicationProcess,
          s.timeline,
          s.simpleEnglishExplanation,
          s.simpleTamilExplanation,
          s.officialChannelKey,
          s.officialResponse || null
        ]
      );
    }
    console.log(`✅ [Seed] ${INITIAL_SCHEMES.length} schemes seeded.`);
  } else {
    console.log('ℹ️ [Seed] Schemes table already populated.');
  }

  // 4. Seed Scheme Reports
  const reportsCountRes = await query('SELECT count(*) FROM scheme_reports');
  if (parseInt(reportsCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding initial scheme reports...');
    for (const r of INITIAL_SCHEME_REPORTS) {
      await query(
        `INSERT INTO scheme_reports (
          id, scheme_id, user_id, citizen_name, is_anonymous,
          district, college, location_detail, category, language,
          report_text, delay_days, attachments, evidence_count,
          evidence_type, status, date_reported, upvotes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO NOTHING`,
        [
          r.id,
          r.schemeId,
          r.userId || 'demo-citizen-01',
          r.citizenName || 'Anonymous Citizen',
          r.isAnonymous ?? true,
          r.district || 'Chennai',
          r.college || null,
          r.locationDetail || null,
          r.category,
          r.language || 'English',
          r.reportText,
          r.delayDays || null,
          JSON.stringify(r.attachments || []),
          r.evidenceCount || 0,
          r.evidenceType || 'Citizen testimony',
          r.status || 'Initial Reference',
          r.dateReported || new Date().toISOString().split('T')[0],
          r.upvotes || 1
        ]
      );
    }
    console.log(`✅ [Seed] ${INITIAL_SCHEME_REPORTS.length} scheme reports seeded.`);
  } else {
    console.log('ℹ️ [Seed] Scheme reports table already populated.');
  }

  // 5. Seed Scheme Clusters (Implementation Gap Analysis)
  const schemeClustersCountRes = await query('SELECT count(*) FROM scheme_clusters');
  if (parseInt(schemeClustersCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding scheme clusters / analysis...');
    for (const [schemeId, a] of Object.entries(SCHEME_AGGREGATED_ANALYSIS)) {
      await query(
        `INSERT INTO scheme_clusters (
          id, scheme_id, total_citizen_reports, evidence_count,
          reported_districts, breakdown, platform_summary,
          average_delay_days, implementation_gap_status, official_response
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (scheme_id) DO NOTHING`,
        [
          `SC-${schemeId}`,
          schemeId,
          a.totalCitizenReports || 0,
          a.evidenceCount || 0,
          JSON.stringify(a.reportedDistricts || []),
          JSON.stringify(a.breakdown || []),
          a.platformSummary || '',
          a.averageDelayDays || 30,
          a.implementationGapStatus || 'Requires verification',
          a.officialResponse || null
        ]
      );
    }
    console.log('✅ [Seed] Scheme clusters seeded.');
  } else {
    console.log('ℹ️ [Seed] Scheme clusters table already populated.');
  }

  // 6. Seed Civic Clusters
  const civicClustersCountRes = await query('SELECT count(*) FROM issue_clusters');
  if (parseInt(civicClustersCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding civic issue clusters...');
    for (const c of INITIAL_CIVIC_CLUSTERS) {
      await query(
        `INSERT INTO issue_clusters (
          id, title, category, department, official_channel_key,
          location, district, latitude, longitude, reports_count,
          confirmations_count, evidence_count, affected_locations,
          severity, duration_days, public_support_score, ai_priority_data,
          status, first_reported_date, last_reported_date, trust_label,
          ai_summary, common_keywords, relevant_official_channels,
          grievance_status, official_response
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        ON CONFLICT (id) DO NOTHING`,
        [
          c.id,
          c.title,
          c.category,
          c.department,
          c.officialChannelKey,
          c.location,
          c.district,
          c.coordinates ? c.coordinates[0] : 13.0827,
          c.coordinates ? c.coordinates[1] : 80.2707,
          c.reportsCount || 1,
          c.confirmationsCount || 0,
          c.evidenceCount || 0,
          JSON.stringify(c.affectedLocations || []),
          c.severity || 'Medium',
          c.durationDays || 7,
          c.publicSupportScore || 0,
          JSON.stringify(c.aiPriorityData || {}),
          c.status || 'Monitoring',
          c.firstReportedDate || new Date().toISOString().split('T')[0],
          c.lastReportedDate || new Date().toISOString().split('T')[0],
          c.trustLabel || 'ANALYSIS',
          c.aiSummary || '',
          JSON.stringify(c.commonKeywords || []),
          JSON.stringify(c.relevantOfficialChannels || {}),
          c.grievanceStatus || 'Under Monitoring',
          c.officialResponse || null
        ]
      );
    }
    console.log(`✅ [Seed] ${INITIAL_CIVIC_CLUSTERS.length} civic clusters seeded.`);
  } else {
    console.log('ℹ️ [Seed] Civic clusters table already populated.');
  }

  // 7. Seed Civic Reports
  const civicReportsCountRes = await query('SELECT count(*) FROM issue_reports');
  if (parseInt(civicReportsCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding civic reports...');
    for (const r of INITIAL_CIVIC_REPORTS) {
      await query(
        `INSERT INTO issue_reports (
          id, cluster_id, user_id, text, language,
          location, district, category, sub_issue,
          reported_by, is_anonymous, date, attachments,
          has_photo, photo_url, duration_days, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO NOTHING`,
        [
          r.id,
          r.clusterId,
          r.userId || 'demo-citizen-01',
          r.text,
          r.language || 'English',
          r.location,
          r.district,
          r.category,
          r.subIssue || r.category,
          r.reportedBy || 'Anonymous Citizen',
          r.isAnonymous ?? true,
          r.date || new Date().toISOString().split('T')[0],
          JSON.stringify(r.attachments || []),
          Boolean(r.hasPhoto),
          r.photoUrl || null,
          r.durationDays || 7,
          r.status || 'Initial Reference'
        ]
      );
    }
    console.log(`✅ [Seed] ${INITIAL_CIVIC_REPORTS.length} civic reports seeded.`);
  } else {
    console.log('ℹ️ [Seed] Civic reports table already populated.');
  }

  // 8. Seed Confirmations
  const confirmationsCountRes = await query('SELECT count(*) FROM confirmations');
  if (parseInt(confirmationsCountRes.rows[0].count, 10) === 0) {
    console.log('🌱 [Seed] Seeding confirmations...');
    let totalConfirmations = 0;
    for (const [clusterId, confList] of Object.entries(INITIAL_CONFIRMATIONS)) {
      for (const conf of confList) {
        await query(
          `INSERT INTO confirmations (cluster_id, is_still_problem, citizen, timestamp)
           VALUES ($1, $2, $3, $4)`,
          [
            clusterId,
            conf.isStillProblem,
            conf.citizen || 'Anonymous Citizen',
            conf.timestamp || new Date().toISOString()
          ]
        );
        totalConfirmations++;
      }
    }
    console.log(`✅ [Seed] ${totalConfirmations} confirmations seeded across clusters.`);
  } else {
    console.log('ℹ️ [Seed] Confirmations table already populated.');
  }

  console.log('🎉 [Migration & Seed] Database is ready and fully synced with RAVEN entities!');
}

// Run directly if invoked via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrationsAndSeed()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
