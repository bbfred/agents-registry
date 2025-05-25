"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import translations from "@/translations"

type Language = "en" | "de" | "fr" | "it" | "rm"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Try to get the language from localStorage on client side
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage && ["en", "de", "fr", "it", "rm"].includes(storedLanguage)) {
      setLanguage(storedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    // Get the translation for the current language, fallback to English if not found
    const translation = translations[language]?.[key] || translations.en[key]

    // If translation is still not found, return the key itself
    return translation || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
