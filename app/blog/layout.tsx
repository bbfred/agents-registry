import { FeatureProtection } from "@/components/feature-protection"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureProtection feature="blog">
      {children}
    </FeatureProtection>
  )
}