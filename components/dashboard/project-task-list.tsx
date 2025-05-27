"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Clock, MoreHorizontal, CheckSquare, Edit, Trash2, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Project, Task } from "@/types/dashboard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectTaskListProps {
  project: Project
  tasks: Task[]
  onTaskUpdate: (task: Task) => void
  onTaskCreate: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export function ProjectTaskList({ project, tasks, onTaskUpdate, onTaskCreate, onTaskDelete }: ProjectTaskListProps) {
  const { t } = useLanguage()
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
  })
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all")

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: `task-${Date.now()}`,
      projectId: project.id,
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      priority: newTask.priority,
      createdAt: new Date(),
      ...(newTask.dueDate ? { dueDate: new Date(newTask.dueDate) } : {}),
    }

    onTaskCreate(task)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    })
    setNewTaskDialogOpen(false)
  }

  const handleUpdateTask = () => {
    if (!activeTask || !activeTask.title.trim()) return

    onTaskUpdate(activeTask)
    setEditTaskDialogOpen(false)
  }

  const handleToggleTaskStatus = (task: Task) => {
    const updatedTask = {
      ...task,
      status: task.status === "completed" ? "pending" : "completed",
      ...(task.status !== "completed" ? { completedAt: new Date() } : {}),
    }
    onTaskUpdate(updatedTask)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">{t("high")}</Badge>
      case "medium":
        return <Badge variant="warning">{t("medium")}</Badge>
      case "low":
        return <Badge variant="secondary">{t("low")}</Badge>
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">{t("pending")}</Badge>
      case "in_progress":
        return <Badge variant="warning">{t("in_progress")}</Badge>
      case "completed":
        return <Badge variant="success">{t("completed")}</Badge>
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filter_tasks")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_tasks")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="in_progress">{t("in_progress")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("new_task")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("create_new_task")}</DialogTitle>
              <DialogDescription>{t("create_task_description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">{t("task_title")}</Label>
                <Input
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={t("task_title_placeholder")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">{t("description")}</Label>
                <Textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder={t("task_description_placeholder")}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="taskPriority">{t("priority")}</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as "low" | "medium" | "high" })}
                  >
                    <SelectTrigger id="taskPriority">
                      <SelectValue placeholder={t("select_priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t("low")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="high">{t("high")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskDueDate">{t("due_date")}</Label>
                  <Input
                    id="taskDueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                {t("create_task")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("no_tasks")}</h3>
          <p className="text-muted-foreground mb-4">{t("create_first_task")}</p>
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("new_task")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={task.status === "completed" ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleTaskStatus(task)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                        >
                          {task.title}
                        </h3>
                        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setActiveTask(task)
                                setEditTaskDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit_task")}
                            </DropdownMenuItem>
                            {task.status !== "completed" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  const updatedTask = {
                                    ...task,
                                    status: "in_progress",
                                  }
                                  onTaskUpdate(updatedTask)
                                }}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                {t("mark_in_progress")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive" onClick={() => onTaskDelete(task.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete_task")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {t("created")}: {formatDate(task.createdAt)}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div
                          className={`flex items-center gap-1 ${
                            task.status !== "completed" && new Date(task.dueDate) < new Date() ? "text-red-500" : ""
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {t("due")}: {formatDate(task.dueDate)}
                          </span>
                          {task.status !== "completed" && new Date(task.dueDate) < new Date() && (
                            <AlertCircle className="h-3.5 w-3.5 ml-1" />
                          )}
                        </div>
                      )}
                      {task.completedAt && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckSquare className="h-3.5 w-3.5" />
                          <span>
                            {t("completed")}: {formatDate(task.completedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("edit_task")}</DialogTitle>
          </DialogHeader>
          {activeTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editTaskTitle">{t("task_title")}</Label>
                <Input
                  id="editTaskTitle"
                  value={activeTask.title}
                  onChange={(e) => setActiveTask({ ...activeTask, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editTaskDescription">{t("description")}</Label>
                <Textarea
                  id="editTaskDescription"
                  value={activeTask.description || ""}
                  onChange={(e) => setActiveTask({ ...activeTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editTaskPriority">{t("priority")}</Label>
                  <Select
                    value={activeTask.priority}
                    onValueChange={(value) => setActiveTask({ ...activeTask, priority: value as "low" | "medium" | "high" })}
                  >
                    <SelectTrigger id="editTaskPriority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t("low")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="high">{t("high")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editTaskStatus">{t("status")}</Label>
                  <Select
                    value={activeTask.status}
                    onValueChange={(value) => setActiveTask({ ...activeTask, status: value as "pending" | "in_progress" | "completed" })}
                  >
                    <SelectTrigger id="editTaskStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="in_progress">{t("in_progress")}</SelectItem>
                      <SelectItem value="completed">{t("completed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editTaskDueDate">{t("due_date")}</Label>
                  <Input
                    id="editTaskDueDate"
                    type="date"
                    value={activeTask.dueDate ? new Date(activeTask.dueDate).toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setActiveTask({
                        ...activeTask,
                        dueDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateTask} disabled={!activeTask?.title.trim()}>
              {t("update_task")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
