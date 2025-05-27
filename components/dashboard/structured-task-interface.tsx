"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Users,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types for the task interface
interface Task {
  id: string
  title: string
  description?: string
  status: "completed" | "in-progress" | "pending" | "blocked"
  priority: "high" | "medium" | "low"
  dueDate?: Date
  assignee?: {
    name: string
    avatar?: string
  }
  progress?: number
  subtasks?: Task[]
  tags?: string[]
  agentAssisted?: boolean
}

export function StructuredTaskInterface({
  tasks = [],
  onCreateTask,
}: {
  tasks?: Task[]
  onCreateTask?: () => void
  onUpdateTask?: (task: Task) => void
}) {
  const { t } = useLanguage()
  const [taskList, setTaskList] = useState<Task[]>(tasks)
  const [activeTab, setActiveTab] = useState("all")

  // Filter tasks based on active tab
  const filteredTasks = taskList.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.status === "completed"
    if (activeTab === "in-progress") return task.status === "in-progress"
    if (activeTab === "pending") return task.status === "pending"
    if (activeTab === "blocked") return task.status === "blocked"
    return true
  })

  // Get status icon based on task status
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <Circle className="h-4 w-4 text-gray-400" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  // Get priority badge based on task priority
  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
    }
  }

  // Toggle task status
  const toggleTaskStatus = (taskId: string) => {
    setTaskList((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "pending" : "completed"
          return {
            ...task,
            status: newStatus,
            progress: newStatus === "completed" ? 100 : task.progress,
          }
        }
        return task
      }),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("tasks.title")}</h2>
          <Button onClick={onCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            {t("tasks.createTask")}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="all">{t("tasks.all")}</TabsTrigger>
            <TabsTrigger value="in-progress">{t("tasks.inProgress")}</TabsTrigger>
            <TabsTrigger value="pending">{t("tasks.pending")}</TabsTrigger>
            <TabsTrigger value="completed">{t("tasks.completed")}</TabsTrigger>
            <TabsTrigger value="blocked">{t("tasks.blocked")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted p-3">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-medium">{t("tasks.noTasks")}</h3>
                <p className="text-center text-sm text-muted-foreground">{t("tasks.noTasksDescription")}</p>
                <Button className="mt-4" onClick={onCreateTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("tasks.createTask")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Collapsible key={task.id} className="w-full">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <button onClick={() => toggleTaskStatus(task.id)} className="mt-1">
                          {getStatusIcon(task.status)}
                        </button>
                        <div>
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          {task.description && (
                            <CardDescription className="mt-1 line-clamp-2">{task.description}</CardDescription>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {task.agentAssisted && (
                          <Badge variant="secondary" className="ml-2">
                            AI Assisted
                          </Badge>
                        )}

                        {getPriorityBadge(task.priority)}

                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>{t("tasks.edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("tasks.delete")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("tasks.duplicate")}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {task.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>{t("tasks.progress")}</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="mt-1 h-1" />
                      </div>
                    )}
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="border-t px-4 py-3">
                      <div className="grid gap-4 sm:grid-cols-3">
                        {task.dueDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                              }).format(task.dueDate)}
                            </span>
                          </div>
                        )}

                        {task.assignee && (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="ml-1 text-sm">{task.assignee.name}</span>
                            </div>
                          </div>
                        )}

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-medium">{t("tasks.subtasks")}</h4>
                          <div className="space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-start space-x-2">
                                <button onClick={() => toggleTaskStatus(subtask.id)} className="mt-0.5">
                                  {getStatusIcon(subtask.status)}
                                </button>
                                <span className="text-sm">{subtask.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="border-t px-4 py-3">
                      <div className="flex w-full justify-between">
                        <Button variant="outline" size="sm">
                          {t("tasks.addSubtask")}
                        </Button>
                        <Button size="sm">{t("tasks.markComplete")}</Button>
                      </div>
                    </CardFooter>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
