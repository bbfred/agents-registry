import type { Agent } from "@/types/agent"

export type ProjectStatus = "active" | "completed" | "paused"

export interface Project {
  id: string
  name: string
  description?: string
  agentType: string
  agent: Agent
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
  lastActivity: Date
  chatCount: number
  taskCount: number
  fileCount: number
  color: string
  favorite: boolean
}

export interface Chat {
  id: string
  projectId: string
  title: string
  createdAt: Date
  lastMessageAt: Date
  messageCount: number
  status: "active" | "archived"
  summary?: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: Date
  dueDate?: Date
  completedAt?: Date
}

export interface ProjectFile {
  id: string
  projectId: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  url: string
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalChats: number
  totalTasks: number
  completedTasks: number
  totalFiles: number
}
