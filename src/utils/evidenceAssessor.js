/**
 * Evidence / Image Assessment Utility
 * Evaluates citizen-submitted evidence attachments against reported civic issues.
 *
 * Tiers:
 * - USEFUL_RELEVANT: Useful / Relevant Evidence
 * - UNCLEAR_VAGUE: Unclear / Vague Evidence
 * - POTENTIALLY_IRRELEVANT: Potentially Irrelevant Evidence
 * - NO_EVIDENCE: No Evidence Provided
 *
 * CRITICAL TRUST MODEL RULE:
 * Evidence evaluation is strictly PLATFORM ANALYSIS (🟣).
 * It NEVER converts a report into OFFICIALLY VERIFIED (🟢).
 */

export function assessReportEvidence({ attachments = [], category = '', reportText = '' }) {
  if (!attachments || attachments.length === 0) {
    return {
      tier: 'NO_EVIDENCE',
      label: 'No Evidence Provided',
      badgeType: 'ANALYSIS',
      badgeText: 'Platform Analysis: Text-Only Submission',
      isUseful: false,
      explanation: 'No photo evidence uploaded with report. Relies on citizen testimony.',
      insufficientForVerification: true
    };
  }

  const textLower = reportText.toLowerCase();
  const catLower = category.toLowerCase();
  
  // Keyword relevance vectors for civic categories
  const categoryKeywords = {
    'street infrastructure': ['light', 'dark', 'pole', 'wire', 'bulb', 'street', 'lamp', 'infrastructure'],
    'roads': ['pothole', 'crack', 'asphalt', 'tar', 'trench', 'crater', 'road', 'street'],
    'waste': ['garbage', 'trash', 'bin', 'waste', 'dump', 'plastic', 'debris', 'litter'],
    'drainage': ['drain', 'water', 'sewage', 'overflow', 'channel', 'mud', 'gutter', 'slab'],
    'water': ['pipe', 'leak', 'water', 'tap', 'supply', 'burst', 'flow']
  };

  const relevantTerms = categoryKeywords[catLower] || ['civic', 'issue', 'street', 'area'];

  let matchedImageCount = 0;
  let ambiguousImageCount = 0;
  let irrelevantImageCount = 0;

  attachments.forEach(att => {
    const fileName = (att.name || '').toLowerCase();
    const isImage = att.type?.startsWith('image/') || att.previewUrl || fileName.match(/\.(jpg|jpeg|png|webp|gif)$/i);

    if (!isImage) {
      ambiguousImageCount++;
      return;
    }

    // Heuristic assessment on attachment properties and keywords
    const matchesKeyword = relevantTerms.some(term => fileName.includes(term) || textLower.includes(term));
    const isGenericOrUnrelated = fileName.includes('logo') || fileName.includes('profile') || fileName.includes('avatar') || fileName.includes('document');

    if (isGenericOrUnrelated) {
      irrelevantImageCount++;
    } else if (matchesKeyword || fileName.includes('ci-') || fileName.includes('scene') || fileName.includes('street') || fileName.includes('pothole') || fileName.includes('dump') || fileName.includes('photo') || fileName.includes('img') || att.previewUrl) {
      matchedImageCount++;
    } else {
      ambiguousImageCount++;
    }
  });

  if (irrelevantImageCount > 0 && matchedImageCount === 0) {
    return {
      tier: 'POTENTIALLY_IRRELEVANT',
      label: 'Potentially Irrelevant Evidence',
      badgeType: 'ANALYSIS',
      badgeText: 'Platform Analysis: Potentially Irrelevant Evidence',
      isUseful: false,
      explanation: 'Uploaded media does not appear relevant to the reported civic issue category.',
      insufficientForVerification: true
    };
  }

  if (matchedImageCount > 0) {
    return {
      tier: 'USEFUL_RELEVANT',
      label: 'Useful / Relevant Evidence',
      badgeType: 'ANALYSIS',
      badgeText: 'Platform Analysis: Relevant Visual Evidence',
      isUseful: true,
      explanation: 'Uploaded photo appears relevant to the reported civic issue. (Platform Analysis — Not Official Government Verification)',
      insufficientForVerification: false
    };
  }

  return {
    tier: 'UNCLEAR_VAGUE',
    label: 'Unclear / Vague Evidence',
    badgeType: 'ANALYSIS',
    badgeText: 'Platform Analysis: Unclear / Vague Evidence',
    isUseful: false,
    explanation: 'Available evidence is citizen-reported and insufficient to establish the claim as officially verified.',
    insufficientForVerification: true
  };
}
