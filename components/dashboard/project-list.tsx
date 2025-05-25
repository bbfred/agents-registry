"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Folder, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/dashboard"
import { useLanguage } from "@/contexts/language-context"

interface ProjectListProps {
  projects: Project[]
  onCreateProject: () => void
}

export function ProjectList({ projects, onCreateProject }: ProjectListProps) {
  const { t } = useLanguage()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t("projects")}</CardTitle>
        <Button size="sm" onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-1" />
          {t("new_project")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {project.agentCount} {project.agentCount === 1 ? t("agent") : t("agents")} • {t("updated")}{" "}
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
