import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.ANTHROPIC_API_KEY;
const anthropic = apiKey && apiKey.trim() !== '' ? new Anthropic({ apiKey }) : null;

/**
 * 1. Analyze Scheme Implementation Gap
 * Compares official scheme commitments against citizen ground reports.
 * Returns structured JSON without hallucinating government responses.
 */
export async function analyzeSchemeGap(scheme, reports = []) {
  const totalCitizenReports = reports.length;
  const evidenceReports = reports.filter(r => (r.evidenceCount || (r.attachments && r.attachments.length) > 0));
  const evidenceCount = evidenceReports.reduce((acc, r) => acc + (r.evidenceCount || r.attachments?.length || 1), 0);
  
  // Calculate reported districts
  const districtsSet = new Set(reports.map(r => r.district).filter(Boolean));
  const reportedDistricts = Array.from(districtsSet);
  if (reportedDistricts.length === 0) reportedDistricts.push(scheme.location || 'Tamil Nadu');

  // Compute average delay
  const reportsWithDelay = reports.filter(r => typeof r.delayDays === 'number' && !isNaN(r.delayDays));
  const averageDelayDays = reportsWithDelay.length > 0
    ? Math.round(reportsWithDelay.reduce((acc, r) => acc + r.delayDays, 0) / reportsWithDelay.length)
    : 30;

  // Category breakdown
  const categoryCounts = {};
  reports.forEach(r => {
    const cat = r.category || 'General Implementation Observation';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const breakdown = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    count,
    percentage: totalCitizenReports > 0 ? Math.round((count / totalCitizenReports) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // Default heuristic fallback summary
  let platformSummary = reports.length > 0
    ? `Citizen submissions across ${reportedDistricts.slice(0, 3).join(', ')} predominantly focus on ${breakdown[0]?.category || 'implementation delays'}, with an observed average delay of ${averageDelayDays} days.`
    : `Citizen feedback continues to be compiled for ${scheme.name}.`;

  let implementationGapStatus = totalCitizenReports >= 20 ? 'Potential Implementation Gap' : 'Requires verification';

  // If Claude AI is configured, generate a refined, strictly factual pattern synthesis
  if (anthropic) {
    try {
      const prompt = `You are the AI Analysis engine of RAVEN, an independent civic intelligence platform.
Your task is to analyze ground citizen reports against official government commitments.

CRITICAL RULES:
1. Base your synthesis ONLY on the provided official data and citizen reports.
2. NEVER invent government responses. If no official response is provided, do not claim one exists.
3. Keep the summary objective, concise (under 50 words), and analytical.
4. Output STRICT JSON only.

OFFICIAL SCHEME DATA:
Name: ${scheme.name}
Objective: ${scheme.objective}
Sanctioned Benefit: ${scheme.benefit}
Official Status Claim: ${scheme.officialStatus}

CITIZEN GROUND REPORTS SUMMARY:
Total Reports: ${totalCitizenReports}
Verified Evidence Count: ${evidenceCount}
Average Delay: ${averageDelayDays} days
Districts: ${reportedDistricts.join(', ')}
Category Breakdown: ${JSON.stringify(breakdown)}
Recent Citizen Quotes:
${reports.slice(0, 5).map(r => `- "${r.reportText}" (Category: ${r.category}, Delay: ${r.delayDays || 0}d)`).join('\n')}

Respond with JSON strictly in this format:
{
  "platformSummary": "concise factual synthesis",
  "implementationGapStatus": "Potential Implementation Gap" | "Requires verification" | "Routine Observations"
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseText = message.content[0]?.text?.trim();
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.platformSummary) platformSummary = parsed.platformSummary;
      if (parsed.implementationGapStatus) implementationGapStatus = parsed.implementationGapStatus;
    } catch (err) {
      console.warn('AI analysis fallback used:', err.message);
    }
  }

  return {
    schemeId: scheme.id,
    totalCitizenReports,
    evidenceCount,
    reportedDistricts,
    breakdown,
    platformSummary,
    averageDelayDays,
    implementationGapStatus,
    officialResponse: scheme.officialResponse || null
  };
}

/**
 * 2. Correlate and Cluster Civic Issue Report
 * Matches new civic issue with existing clusters or proposes a new structured cluster.
 */
export async function correlateCivicCluster(newReport, existingClusters = []) {
  // Normalize strings for matching
  const cat = (newReport.category || '').toLowerCase().trim();
  const dist = (newReport.district || '').toLowerCase().trim();
  const loc = (newReport.location || '').toLowerCase().trim();

  // 1. Direct heuristic match on category and district
  const matched = existingClusters.find(c => {
    const cCat = (c.category || '').toLowerCase().trim();
    const cDist = (c.district || '').toLowerCase().trim();
    return cCat === cat && (cDist === dist || dist === '' || cDist.includes(dist) || dist.includes(cDist));
  });

  if (matched) {
    return { isNewCluster: false, clusterId: matched.id, cluster: matched };
  }

  // If no existing cluster matches, generate cluster metadata
  let aiSummary = `Citizen report regarding ${newReport.category} in ${newReport.location || newReport.district}. Platform is monitoring for additional community confirmations.`;
  let commonKeywords = [newReport.category.toLowerCase(), 'citizen report', (newReport.location || '').toLowerCase()].filter(Boolean);

  if (anthropic) {
    try {
      const prompt = `You are the civic clustering engine of RAVEN platform.
A citizen has submitted a municipal civic issue report:
Category: ${newReport.category}
Location: ${newReport.location}
District: ${newReport.district}
Text: "${newReport.text}"

Generate a structured cluster summary and keywords. Output STRICT JSON:
{
  "title": "${newReport.category} Issue — ${newReport.location || newReport.district}",
  "aiSummary": "concise 2-sentence summary of the issue",
  "commonKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseText = message.content[0]?.text?.trim();
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.aiSummary) aiSummary = parsed.aiSummary;
      if (Array.isArray(parsed.commonKeywords)) commonKeywords = parsed.commonKeywords;
    } catch (err) {
      console.warn('AI civic clustering fallback used:', err.message);
    }
  }

  const newClusterId = `CI-${Date.now().toString().slice(-4)}`;
  return {
    isNewCluster: true,
    clusterId: newClusterId,
    clusterData: {
      id: newClusterId,
      title: `${newReport.category} Issue — ${newReport.location || newReport.district}`,
      category: newReport.category,
      department: 'Local Municipal Corporation',
      officialChannelKey: newReport.category.toLowerCase().includes('light') ? 'streetlights' : (newReport.category.toLowerCase().includes('waste') ? 'waste' : 'roads'),
      location: newReport.location || `${newReport.district} Local Area`,
      district: newReport.district || 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
      reportsCount: 1,
      confirmationsCount: 1,
      evidenceCount: (newReport.attachments && newReport.attachments.length) || 0,
      affectedLocations: [newReport.location || newReport.district],
      severity: 'Medium',
      durationDays: parseInt(newReport.durationDays, 10) || 7,
      publicSupportScore: 10,
      status: 'Monitoring',
      firstReportedDate: new Date().toISOString().split('T')[0],
      lastReportedDate: new Date().toISOString().split('T')[0],
      trustLabel: 'ANALYSIS',
      aiSummary,
      commonKeywords,
      relevantOfficialChannels: {
        portal: 'https://gccservices.chennaicorporation.gov.in/pgr',
        helpline: '1913',
        email: 'grievances@chennaicorporation.gov.in'
      },
      grievanceStatus: 'Under Monitoring',
      officialResponse: null
    }
  };
}

/**
 * 3. Generate Natural Language Priority Explanation
 * Explains the calculated priority score using strictly real factor inputs without inventing facts.
 */
export async function generatePriorityExplanation(priorityData, cluster) {
  const { score, breakdown, weights } = priorityData;
  const baseExplanation = `Platform Priority Assessment of ${score}/100 based on ${cluster.reportsCount} clustered reports (${weights.volume} weight), ${cluster.severity} severity (${weights.severity} weight), ${cluster.durationDays} days duration (${weights.duration} weight), ${cluster.affectedLocations?.length || 1} affected streets (${weights.spread} weight), and ${cluster.evidenceCount} verified evidence items (${weights.evidence} weight).`;

  if (!anthropic) return baseExplanation;

  try {
    const prompt = `You are explaining the RAVEN Civic Priority Score to citizens.
Strict rule: Do NOT invent numbers or change factor weights. Use ONLY these true inputs:
- Final Score: ${score}/100
- Clustered Reports: ${cluster.reportsCount} (Volume factor: ${breakdown.volumeScore}/100, weight 30%)
- Civic Severity: ${cluster.severity} (Severity factor: ${breakdown.severityScore}/100, weight 25%)
- Persisted Duration: ${cluster.durationDays} days (Duration factor: ${breakdown.durationScore}/100, weight 20%)
- Geographic Spread: ${cluster.affectedLocations?.length || 1} locations (Spread factor: ${breakdown.spreadScore}/100, weight 15%)
- Citizen Evidence Submissions: ${cluster.evidenceCount} (Evidence factor: ${breakdown.evidenceScore}/100, weight 10%)

Produce a single clear, factual explanatory paragraph of 2-3 sentences.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0]?.text?.trim() || baseExplanation;
  } catch (err) {
    return baseExplanation;
  }
}
