"use client"

import { useLanguage } from "@/contexts/language-context"
import { cloneElement, isValidElement } from "react"
import type { ReactNode } from "react"

interface ClientPageProps {
  children: ReactNode | ((props: { t: (key: string) => string; language: string }) => ReactNode)
}

export function ClientPage({ children }: ClientPageProps) {
  const { t, language } = useLanguage()

  // If children is a function, call it with t and language
  if (typeof children === 'function') {
    return <>{children({ t, language })}</>
  }

  // Otherwise, just render the children
  return <>{children}</>
}
