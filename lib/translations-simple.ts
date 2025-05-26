// Simple translation function for MVP (English only)
// This maintains the same API as the full translation system
// but without the complexity of client-side language switching

import translations from '@/translations'

// For MVP, just return English translations
export function getTranslations() {
  return translations.en
}

// Server-side translation function
export function createTranslator() {
  const messages = getTranslations()
  
  return function t(key: string): string {
    return messages[key as keyof typeof messages] || key
  }
}