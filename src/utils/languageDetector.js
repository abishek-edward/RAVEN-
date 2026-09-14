/**
 * Tamil / English / Tanglish classification
 */

export function detectLanguage(text = '') {
  if (!text || typeof text !== 'string') {
    return 'English';
  }

  const trimmed = text.trim();
  if (!trimmed) return 'English';

  // Unicode range for Tamil: U+0B80 to U+0BFF
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const englishRegex = /[a-zA-Z]/;

  const hasTamilScript = tamilRegex.test(trimmed);
  const hasEnglishScript = englishRegex.test(trimmed);

  // Common Tanglish (Romanized Tamil) marker words
  const tanglishMarkers = [
    /\b(romba|illai|illa|irukku|varala|pannunga|panna|kudukala|mudiyala|mudila|seri|aachu|pannitanga|theriyala|podunga|vanthuchi|vanthuchu|pannirukanga|velai|seyyala|panam|kaasu|thittam|oda|kitta|la|ku|kaga)\b/i
  ];

  const hasTanglishWords = tanglishMarkers.some(regex => regex.test(trimmed));

  if (hasTamilScript && hasEnglishScript) {
    return 'Mixed (Tamil + English)';
  }

  if (hasTamilScript) {
    return 'Tamil';
  }

  if (hasTanglishWords) {
    return 'Mixed (Tamil + English)';
  }

  return 'English';
}
