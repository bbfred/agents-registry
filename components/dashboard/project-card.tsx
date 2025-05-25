"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckSquare, FileText, Star, Calendar, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/types/dashboard"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
  project: Project
  onToggleFavorite: (projectId: string) => void
  onArchive?: (projectId: string) => void
}

export function ProjectCard({ project, onToggleFavorite, onArchive }: ProjectCardProps) {
  const { t } = useLanguage()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/dashboard/projects/${project.id}`} className="block">
        <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className={`absolute inset-0 ${project.color} opacity-80`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/90 p-2">
              <Image
                src={project.agent.logo || "/placeholder.svg"}
                alt={project.agent.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">{getStatusBadge()}</div>
          <div className="absolute top-3 left-3">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full bg-white/80 ${project.favorite ? "text-yellow-500" : "text-gray-400"}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(project.id)
              }}
            >
              <Star className={`h-4 w-4 ${project.favorite ? "fill-yellow-500" : ""}`} />
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-3">
          <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{project.agentType}</p>
          {project.description && <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{project.chatCount}</span>
            <span className="text-gray-500 text-xs">{t("chats")}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <span className="font-medium">{project.taskCount}</span>
            <span className="text-gray-500 text-xs">{t("tasks")}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{project.fileCount}</span>
            <span className="text-gray-500 text-xs">{t("files")}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {t("updated")} {formatDate(project.lastActivity)}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleFavorite(project.id)}>
              {project.favorite ? t("remove_from_favorites") : t("add_to_favorites")}
            </DropdownMenuItem>
            {project.status === "active" && onArchive && (
              <DropdownMenuItem onClick={() => onArchive(project.id)}>{t("archive_project")}</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
