"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ProjectCard } from "@/components/dashboard/project-card"
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star, Grid3X3, List, FolderPlus, MessageSquare, CheckSquare, FileText } from "lucide-react"
import { mockProjects, mockChats, mockTasks, dashboardStats } from "@/data/dashboard"
import type { Project } from "@/types/dashboard"
import { allAgents } from "@/data/agents"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  // Filter projects based on search, favorites, and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.agentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFavorites = showFavoritesOnly ? project.favorite : true
    const matchesTab = activeTab === "all" || project.status === activeTab
    return matchesSearch && matchesFavorites && matchesTab
  })

  // Recent activity
  const recentChats = [...mockChats]
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .slice(0, 5)

  const pendingTasks = mockTasks.filter((task) => task.status === "pending").slice(0, 5)

  const handleCreateProject = (projectData: {
    name: string
    description: string
    agentType: string
    agentId: string
  }) => {
    const agent = allAgents.find((a) => a.id === projectData.agentId)
    if (!agent) return

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-indigo-500"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      agentType: projectData.agentType,
      agent,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date(),
      chatCount: 0,
      taskCount: 0,
      fileCount: 0,
      color: randomColor,
      favorite: false,
    }

    setProjects((prev) => [newProject, ...prev])
  }

  const handleToggleFavorite = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return { ...project, favorite: !project.favorite }
        }
        return project
      }),
    )
  }

  const handleArchiveProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return { ...project, status: "completed" as const }
        }
        return project
      }),
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("my_projects")}</h1>
          <p className="text-gray-500">{t("organize_your_work_with_ai_agents")}</p>
        </div>
        <NewProjectDialog onCreateProject={handleCreateProject} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("active_projects")}</CardTitle>
            <FolderPlus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalProjects} {t("total")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("total_chats")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalChats}</div>
            <p className="text-xs text-muted-foreground">{t("across_all_projects")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("completed_tasks")}</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalTasks} {t("total")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("total_files")}</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">{t("uploaded_and_generated")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">{t("active")}</TabsTrigger>
                <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
                <TabsTrigger value="all">{t("all")}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("search_projects")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[250px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-white" : ""}`} />
                  {t("favorites")}
                </Button>
                <div className="border rounded-md flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-muted/40 rounded-lg">
              <FolderPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {projects.length === 0 ? t("no_projects_yet") : t("no_projects_found")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {projects.length === 0 ? t("create_first_project") : t("try_different_search")}
              </p>
              {projects.length === 0 && <NewProjectDialog onCreateProject={handleCreateProject} />}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleFavorite={handleToggleFavorite}
                  onArchive={handleArchiveProject}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Recent Chats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                {t("recent_chats")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentChats.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">{t("no_recent_chats")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentChats.map((chat) => {
                    const project = projects.find((p) => p.id === chat.projectId)
                    return (
                      <div key={chat.id} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm mb-1 truncate">{chat.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{project?.name}</div>
                        <div className="text-xs text-gray-400">
                          {new Intl.DateTimeFormat("default", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(chat.lastMessageAt)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-500" />
                {t("pending_tasks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">{t("no_pending_tasks")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId)
                    return (
                      <div key={task.id} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm mb-1 truncate">{task.title}</div>
                        <div className="text-xs text-gray-500 mb-1">{project?.name}</div>
                        {task.dueDate && (
                          <div className="text-xs text-red-500">
                            {t("due")}:{" "}
                            {new Intl.DateTimeFormat("default", {
                              day: "2-digit",
                              month: "2-digit",
                            }).format(task.dueDate)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
