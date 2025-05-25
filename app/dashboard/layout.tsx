import type React from "react"
import { DashboardSidebarProvider } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardSidebarProvider>{children}</DashboardSidebarProvider>
}
