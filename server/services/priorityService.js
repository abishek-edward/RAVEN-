/**
 * Deterministic AI-Assisted Priority Score calculation
 * STRICTLY MANDATED WEIGHTS:
 * - Report Volume: 30%
 * - Severity: 25%
 * - Duration: 20%
 * - Geographic Spread: 15%
 * - Evidence Density: 10%
 *
 * NOTE: This calculation is strictly deterministic and reproducible.
 * AI models MUST NEVER modify these weights or replace the score calculation.
 */

export function calculateAIAssistedPriorityScore({
  reportCount = 0,
  severityLevel = 'Medium', // 'Low', 'Medium', 'High', 'Critical'
  durationDays = 1,
  affectedLocationsCount = 1,
  evidenceCount = 0,
}) {
  // 1. Report Volume factor (0 - 100): scale up to 250 reports = 100
  const volumeScore = Math.min(100, Math.round((reportCount / 250) * 100));

  // 2. Severity factor (0 - 100)
  const severityMap = {
    'Low': 25,
    'Medium': 50,
    'High': 80,
    'Critical': 100,
  };
  const severityScore = severityMap[severityLevel] || 50;

  // 3. Duration factor (0 - 100): scale up to 30 days = 100
  const durationScore = Math.min(100, Math.round((durationDays / 30) * 100));

  // 4. Geographic Spread (0 - 100): scale up to 5 distinct streets/areas = 100
  const spreadScore = Math.min(100, Math.round((affectedLocationsCount / 5) * 100));

  // 5. Evidence Density (0 - 100): ratio of evidence to reports, normalized
  const evidenceRatio = reportCount > 0 ? (evidenceCount / reportCount) : 0;
  const evidenceScore = Math.min(100, Math.round(evidenceRatio * 200));

  // Weighted sum (Strict 30 / 25 / 20 / 15 / 10)
  const weightedTotal =
    (volumeScore * 0.30) +
    (severityScore * 0.25) +
    (durationScore * 0.20) +
    (spreadScore * 0.15) +
    (evidenceScore * 0.10);

  const finalScore = Math.min(99, Math.max(15, Math.round(weightedTotal)));

  // Objective factual natural-language explanation
  const explanation = `Platform Priority Assessment of ${finalScore}/100 based on ${reportCount} clustered reports (30% weight), ${severityLevel} civic severity rating (25% weight), ${durationDays} days reported duration (20% weight), ${affectedLocationsCount} affected streets/junctions (15% weight), and ${evidenceCount} verified citizen evidence submissions (10% weight).`;

  return {
    score: finalScore,
    breakdown: {
      volumeScore,
      severityScore,
      durationScore,
      spreadScore,
      evidenceScore,
    },
    weights: {
      volume: '30%',
      severity: '25%',
      duration: '20%',
      spread: '15%',
      evidence: '10%',
    },
    explanation,
  };
}
