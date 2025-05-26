"use client"

import { useLanguage } from "@/contexts/language-context"

interface WithLanguageProps {
  children: React.ReactNode
}

// This component provides language context to its children
export function WithLanguage({ children }: WithLanguageProps) {
  return <>{children}</>
}

// HOC to inject language props into any component
export function withLanguageProps<P extends { t: (key: string) => string; language: string }>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: Omit<P, 't' | 'language'>) {
    const { t, language } = useLanguage()
    return <Component {...(props as P)} t={t} language={language} />
  }
}