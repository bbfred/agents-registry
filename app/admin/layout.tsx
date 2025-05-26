import { FeatureProtection } from "@/components/feature-protection"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureProtection feature="adminPanel">
      {children}
    </FeatureProtection>
  )
}