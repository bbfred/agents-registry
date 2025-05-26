import type React from "react"
import { DashboardSidebarProvider } from "@/components/dashboard/sidebar"
import { DashboardProtection } from "@/components/dashboard-protection"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProtection>
      <DashboardSidebarProvider>{children}</DashboardSidebarProvider>
    </DashboardProtection>
  )
}
