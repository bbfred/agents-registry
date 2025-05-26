import { FeatureProtection } from "@/components/feature-protection"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureProtection feature="demo">
      {children}
    </FeatureProtection>
  )
}