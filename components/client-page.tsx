"use client"

import { useLanguage } from "@/contexts/language-context"
import type { ReactNode } from "react"

interface ClientPageProps {
  children: (props: { t: (key: string) => string; language: string }) => ReactNode
}

export function ClientPage({ children }: ClientPageProps) {
  const { t, language } = useLanguage()

  return <>{children({ t, language })}</>
}
