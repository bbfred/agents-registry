"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MessageSquare,
  CheckSquare,
  FileText,
  Calendar,
  Star,
  MoreHorizontal,
  Edit,
  Archive,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockProjects, mockChats, mockTasks, mockFiles } from "@/data/dashboard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectChatInterface } from "@/components/dashboard/project-chat-interface"
import { ProjectTaskList } from "@/components/dashboard/project-task-list"
import { ProjectFileList } from "@/components/dashboard/project-file-list"

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState(mockProjects.find((p) => p.id === params.id))
  const [projectChats, setProjectChats] = useState(mockChats.filter((c) => c.projectId === params.id))
  const [projectTasks, setProjectTasks] = useState(mockTasks.filter((t) => t.projectId === params.id))
  const [projectFiles, setProjectFiles] = useState(mockFiles.filter((f) => f.projectId === params.id))
  const [isFavorite, setIsFavorite] = useState(project?.favorite || false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!project) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">{t("project_not_found")}</h2>
          <p className="text-gray-500 mb-4">{t("project_not_found_description")}</p>
          <Button asChild>
            <Link href="/dashboard">{t("back_to_dashboard")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    setProject((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        favorite: !prev.favorite,
      }
    })
  }

  const getStatusBadge = () => {
    switch (project.status) {
      case "active":
        return <Badge variant="success">{t("active")}</Badge>
      case "completed":
        return <Badge variant="secondary">{t("completed")}</Badge>
      case "paused":
        return <Badge variant="warning">{t("paused")}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {getStatusBadge()}
          </div>
          <p className="text-gray-500">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${isFavorite ? "text-yellow-500" : "text-gray-400"}`}
            onClick={handleToggleFavorite}
          >
            <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-500" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit_project")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                {t("archive_project")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t("delete_project")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("project_info")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white p-2 border">
                  <Image
                    src={project.agent.logo || "/placeholder.svg"}
                    alt={project.agent.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium">{project.agent.name}</div>
                  <div className="text-sm text-gray-500">{project.agentType}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">{t("chats")}</div>
                    <div className="text-gray-500">{project.chatCount}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{t("tasks")}</div>
                    <div className="text-gray-500">{project.taskCount}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">{t("files")}</div>
                    <div className="text-gray-500">{project.fileCount}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">{t("created")}</div>
                    <div className="text-gray-500">{formatDate(project.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-1">{t("agent_capabilities")}</div>
                <div className="space-y-1">
                  {project.agent.capabilities.slice(0, 4).map((capability, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      </div>
                      <span>{capability}</span>
                    </div>
                  ))}
                  {project.agent.capabilities.length > 4 && (
                    <div className="text-sm text-primary">
                      +{project.agent.capabilities.length - 4} {t("more")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {t("chat")}
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                {t("tasks")}
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {t("files")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ProjectChatInterface
                project={project}
                chats={projectChats}
                onNewChat={(chat) => setProjectChats((prev) => [chat, ...prev])}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <ProjectTaskList
                project={project}
                tasks={projectTasks}
                onTaskUpdate={(updatedTask) => {
                  setProjectTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
                }}
                onTaskCreate={(newTask) => {
                  setProjectTasks((prev) => [newTask, ...prev])
                }}
                onTaskDelete={(taskId) => {
                  setProjectTasks((prev) => prev.filter((task) => task.id !== taskId))
                }}
              />
            </TabsContent>

            <TabsContent value="files">
              <ProjectFileList
                project={project}
                files={projectFiles}
                onFileUpload={(newFile) => {
                  setProjectFiles((prev) => [newFile, ...prev])
                }}
                onFileDelete={(fileId) => {
                  setProjectFiles((prev) => prev.filter((file) => file.id !== fileId))
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
