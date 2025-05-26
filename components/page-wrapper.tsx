import { createTranslator } from '@/lib/translations-simple'
import type { ReactElement } from 'react'

interface PageWrapperProps {
  children: (props: { t: (key: string) => string }) => ReactElement
}

// Server-side compatible wrapper that provides translation function
export function PageWrapper({ children }: PageWrapperProps) {
  const t = createTranslator()
  return children({ t })
}