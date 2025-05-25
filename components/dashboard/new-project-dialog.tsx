"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { allAgents } from "@/data/agents"
import Image from "next/image"

interface NewProjectDialogProps {
  onCreateProject: (project: {
    name: string
    description: string
    agentType: string
    agentId: string
  }) => void
}

export function NewProjectDialog({ onCreateProject }: NewProjectDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    agentType: "",
    agentId: "",
  })

  const selfHostedAgents = allAgents.filter((agent) => agent.selfHosted)

  const agentCategories = [
    {
      id: "customer-service",
      name: t("customer_service"),
      agents: selfHostedAgents.filter((a) => a.categories.includes("Kundenservice")),
    },
    {
      id: "translation",
      name: t("translation"),
      agents: selfHostedAgents.filter((a) => a.categories.includes("Übersetzung")),
    },
    {
      id: "household",
      name: t("household_management"),
      agents: selfHostedAgents.filter((a) => a.categories.includes("Haushaltsverwaltung")),
    },
    {
      id: "technical",
      name: t("technical_support"),
      agents: selfHostedAgents.filter((a) => a.categories.includes("Technischer Support")),
    },
  ]

  const selectedCategory = agentCategories.find((cat) => cat.id === formData.agentType)
  const availableAgents = selectedCategory?.agents || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.agentType && formData.agentId) {
      onCreateProject(formData)
      setFormData({ name: "", description: "", agentType: "", agentId: "" })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("new_project")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("create_new_project")}</DialogTitle>
          <DialogDescription>{t("create_project_description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("project_name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("project_name_placeholder")}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                {t("description")} ({t("optional")})
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("project_description_placeholder")}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agentType">{t("agent_type")}</Label>
              <Select
                value={formData.agentType}
                onValueChange={(value) => setFormData({ ...formData, agentType: value, agentId: "" })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_agent_type")} />
                </SelectTrigger>
                <SelectContent>
                  {agentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.agentType && (
              <div className="grid gap-2">
                <Label htmlFor="agent">{t("choose_agent")}</Label>
                <Select
                  value={formData.agentId}
                  onValueChange={(value) => setFormData({ ...formData, agentId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_agent")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <div className="relative w-6 h-6 rounded overflow-hidden">
                            <Image
                              src={agent.logo || "/placeholder.svg"}
                              alt={agent.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.agentType || !formData.agentId}>
              {t("create_project")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
