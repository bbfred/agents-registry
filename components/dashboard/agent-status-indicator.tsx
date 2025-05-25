import { Badge } from "@/components/ui/badge"
import type { AgentStatus } from "@/types/dashboard"

interface AgentStatusIndicatorProps {
  status: AgentStatus
}

export function AgentStatusIndicator({ status }: AgentStatusIndicatorProps) {
  const statusConfig = {
    active: {
      variant: "success" as const,
      label: "Active",
    },
    inactive: {
      variant: "secondary" as const,
      label: "Inactive",
    },
    busy: {
      variant: "warning" as const,
      label: "Busy",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}
