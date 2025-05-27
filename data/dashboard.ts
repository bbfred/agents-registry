import { allAgents } from "@/data/agents"
import type { Project, Chat, Task, ProjectFile, DashboardStats } from "@/types/dashboard"

const selfHostedAgents = allAgents.filter((agent) => agent.selfHosted)

export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Customer Support Hub",
    description: "Handle all customer inquiries and support requests",
    agentType: "Customer Service",
    agent: selfHostedAgents.find((a) => a.id === "swiss-customer-support")!,
    status: "active",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 11, 29),
    lastActivity: new Date(2023, 11, 29, 14, 35),
    chatCount: 8,
    taskCount: 12,
    fileCount: 5,
    color: "bg-blue-500",
    favorite: true,
  },
  {
    id: "project-2",
    name: "Document Translation",
    description: "Translate business documents between languages",
    agentType: "Translation",
    agent: selfHostedAgents.find((a) => a.id === "swiss-translator")!,
    status: "active",
    createdAt: new Date(2023, 7, 3),
    updatedAt: new Date(2023, 11, 28),
    lastActivity: new Date(2023, 11, 28, 16, 20),
    chatCount: 4,
    taskCount: 6,
    fileCount: 15,
    color: "bg-green-500",
    favorite: false,
  },
  {
    id: "project-3",
    name: "Family Organization",
    description: "Manage household tasks and family schedules",
    agentType: "Household Management",
    agent: selfHostedAgents.find((a) => a.id === "swiss-household-manager")!,
    status: "active",
    createdAt: new Date(2023, 9, 22),
    updatedAt: new Date(2023, 11, 29),
    lastActivity: new Date(2023, 11, 29, 19, 45),
    chatCount: 12,
    taskCount: 25,
    fileCount: 8,
    color: "bg-purple-500",
    favorite: true,
  },
  {
    id: "project-4",
    name: "Tech Support Archive",
    description: "Completed IT support project",
    agentType: "Technical Support",
    agent: selfHostedAgents.find((a) => a.id === "swiss-tech-support")!,
    status: "completed",
    createdAt: new Date(2023, 4, 10),
    updatedAt: new Date(2023, 10, 15),
    lastActivity: new Date(2023, 10, 15, 10, 30),
    chatCount: 6,
    taskCount: 8,
    fileCount: 3,
    color: "bg-gray-500",
    favorite: false,
  },
]

export const mockChats: Chat[] = [
  // Customer Support Hub chats
  {
    id: "chat-1",
    projectId: "project-1",
    title: "Product inquiry from John",
    createdAt: new Date(2023, 11, 25, 10, 30),
    lastMessageAt: new Date(2023, 11, 29, 14, 35),
    messageCount: 15,
    status: "active",
    summary: "Customer asking about product features and pricing",
  },
  {
    id: "chat-2",
    projectId: "project-1",
    title: "Billing question from Maria",
    createdAt: new Date(2023, 11, 26, 9, 15),
    lastMessageAt: new Date(2023, 11, 28, 11, 20),
    messageCount: 8,
    status: "active",
    summary: "Customer needs help understanding their invoice",
  },
  {
    id: "chat-3",
    projectId: "project-1",
    title: "Return request from Thomas",
    createdAt: new Date(2023, 11, 20, 14, 45),
    lastMessageAt: new Date(2023, 11, 22, 16, 30),
    messageCount: 12,
    status: "archived",
    summary: "Customer wants to return a product",
  },

  // Document Translation chats
  {
    id: "chat-4",
    projectId: "project-2",
    title: "Contract translation DE-FR",
    createdAt: new Date(2023, 11, 26, 11, 30),
    lastMessageAt: new Date(2023, 11, 28, 16, 20),
    messageCount: 6,
    status: "active",
    summary: "Translating legal contract from German to French",
  },
  {
    id: "chat-5",
    projectId: "project-2",
    title: "Website content translation",
    createdAt: new Date(2023, 11, 24, 9, 15),
    lastMessageAt: new Date(2023, 11, 26, 14, 30),
    messageCount: 8,
    status: "archived",
    summary: "Translating website content for multiple languages",
  },

  // Family Organization chats
  {
    id: "chat-6",
    projectId: "project-3",
    title: "Weekly meal planning",
    createdAt: new Date(2023, 11, 28, 18, 30),
    lastMessageAt: new Date(2023, 11, 29, 19, 45),
    messageCount: 10,
    status: "active",
    summary: "Planning meals for the upcoming week",
  },
  {
    id: "chat-7",
    projectId: "project-3",
    title: "Holiday schedule coordination",
    createdAt: new Date(2023, 11, 20, 19, 45),
    lastMessageAt: new Date(2023, 11, 27, 20, 15),
    messageCount: 16,
    status: "active",
    summary: "Coordinating family activities for the holidays",
  },
]

export const mockTasks: Task[] = [
  // Customer Support Hub tasks
  {
    id: "task-1",
    projectId: "project-1",
    title: "Follow up with John about product demo",
    description: "Schedule a product demonstration call",
    status: "pending",
    priority: "high",
    createdAt: new Date(2023, 11, 29, 14, 35),
    dueDate: new Date(2023, 11, 30, 10, 0),
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Send invoice explanation to Maria",
    description: "Create detailed breakdown of billing charges",
    status: "completed",
    priority: "medium",
    createdAt: new Date(2023, 11, 28, 11, 20),
    completedAt: new Date(2023, 11, 28, 15, 30),
  },

  // Document Translation tasks
  {
    id: "task-3",
    projectId: "project-2",
    title: "Review translated contract",
    description: "Quality check the German to French translation",
    status: "in_progress",
    priority: "high",
    createdAt: new Date(2023, 11, 28, 16, 20),
    dueDate: new Date(2023, 11, 30, 17, 0),
  },

  // Family Organization tasks
  {
    id: "task-4",
    projectId: "project-3",
    title: "Buy groceries for this week",
    description: "Purchase items from the meal planning list",
    status: "pending",
    priority: "medium",
    createdAt: new Date(2023, 11, 29, 19, 45),
    dueDate: new Date(2023, 11, 30, 18, 0),
  },
  {
    id: "task-5",
    projectId: "project-3",
    title: "Book restaurant for Christmas dinner",
    description: "Make reservation for family Christmas dinner",
    status: "completed",
    priority: "high",
    createdAt: new Date(2023, 11, 20, 19, 45),
    completedAt: new Date(2023, 11, 25, 14, 20),
  },
]

export const mockFiles: ProjectFile[] = [
  // Customer Support Hub files
  {
    id: "file-1",
    projectId: "project-1",
    name: "Customer_Feedback_Report.pdf",
    type: "application/pdf",
    size: 2048000,
    uploadedAt: new Date(2023, 11, 25, 16, 30),
    url: "/files/customer-feedback-report.pdf",
  },
  {
    id: "file-2",
    projectId: "project-1",
    name: "Product_Catalog_2024.pdf",
    type: "application/pdf",
    size: 5120000,
    uploadedAt: new Date(2023, 11, 20, 9, 15),
    url: "/files/product-catalog-2024.pdf",
  },

  // Document Translation files
  {
    id: "file-3",
    projectId: "project-2",
    name: "Contract_Original_DE.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1024000,
    uploadedAt: new Date(2023, 11, 26, 11, 30),
    url: "/files/contract-original-de.docx",
  },
  {
    id: "file-4",
    projectId: "project-2",
    name: "Contract_Translated_FR.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1024000,
    uploadedAt: new Date(2023, 11, 28, 16, 20),
    url: "/files/contract-translated-fr.docx",
  },

  // Family Organization files
  {
    id: "file-5",
    projectId: "project-3",
    name: "Family_Calendar_December.pdf",
    type: "application/pdf",
    size: 512000,
    uploadedAt: new Date(2023, 11, 28, 18, 30),
    url: "/files/family-calendar-december.pdf",
  },
  {
    id: "file-6",
    projectId: "project-3",
    name: "Shopping_List_Template.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 256000,
    uploadedAt: new Date(2023, 11, 15, 10, 45),
    url: "/files/shopping-list-template.xlsx",
  },
]

export const dashboardStats: DashboardStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === "active").length,
  totalChats: mockChats.length,
  totalTasks: mockTasks.length,
  completedTasks: mockTasks.filter((t) => t.status === "completed").length,
  totalFiles: mockFiles.length,
}

// Mock agent instances for dashboard
export const mockAgentInstances = [
  {
    id: "agent-1",
    agent: selfHostedAgents[0],
    category: "Customer Service",
    status: "active" as const,
    conversationCount: 8,
    dateAdded: new Date(2023, 5, 15),
    favorite: true,
  },
  {
    id: "agent-2",
    agent: selfHostedAgents[1],
    category: "Translation",
    status: "active" as const,
    conversationCount: 4,
    dateAdded: new Date(2023, 7, 3),
    favorite: false,
  },
]

// Mock conversations for agents
export const mockConversations = [
  {
    id: "conv-1",
    agentInstanceId: "agent-1",
    title: "Product inquiry from John",
    messageCount: 15,
    lastMessageDate: new Date(2023, 11, 29, 14, 35),
    status: "active" as const,
  },
  {
    id: "conv-2",
    agentInstanceId: "agent-1",
    title: "Billing question from Maria",
    messageCount: 8,
    lastMessageDate: new Date(2023, 11, 28, 11, 20),
    status: "active" as const,
  },
  {
    id: "conv-3",
    agentInstanceId: "agent-2",
    title: "Contract translation DE-FR",
    messageCount: 6,
    lastMessageDate: new Date(2023, 11, 28, 16, 20),
    status: "active" as const,
  },
]
