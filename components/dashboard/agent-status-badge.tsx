import { Badge } from "@/components/ui/badge"
import type { AgentStatus } from "@/types/dashboard"

interface AgentStatusBadgeProps {
  status: AgentStatus
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const statusConfig = {
    running: {
      variant: "success" as const,
      label: "Running",
    },
    stopped: {
      variant: "secondary" as const,
      label: "Stopped",
    },
    error: {
      variant: "destructive" as const,
      label: "Error",
    },
    starting: {
      variant: "warning" as const,
      label: "Starting",
    },
    stopping: {
      variant: "warning" as const,
      label: "Stopping",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}
