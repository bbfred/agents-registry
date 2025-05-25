"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { StreamingChatInterface } from "@/components/dashboard/streaming-chat-interface"
import { StructuredTaskInterface } from "@/components/dashboard/structured-task-interface"
import { FileManagementInterface } from "@/components/dashboard/file-management-interface"

// Sample data
const sampleTasks = [
  {
    id: "1",
    title: "Create marketing campaign for Q3",
    description: "Develop a comprehensive marketing strategy for the third quarter focusing on our new product line.",
    status: "in-progress" as const,
    priority: "high" as const,
    dueDate: new Date("2023-09-15"),
    assignee: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    progress: 45,
    tags: ["Marketing", "Q3"],
    agentAssisted: true,
    subtasks: [
      {
        id: "1-1",
        title: "Research competitor strategies",
        status: "completed" as const,
        priority: "medium" as const,
      },
      {
        id: "1-2",
        title: "Draft initial campaign concepts",
        status: "in-progress" as const,
        priority: "high" as const,
      },
      {
        id: "1-3",
        title: "Create budget proposal",
        status: "pending" as const,
        priority: "medium" as const,
      },
    ],
  },
  {
    id: "2",
    title: "Prepare quarterly financial report",
    description: "Compile and analyze financial data for Q2 2023.",
    status: "pending" as const,
    priority: "medium" as const,
    dueDate: new Date("2023-08-30"),
    progress: 0,
    tags: ["Finance", "Report"],
  },
  {
    id: "3",
    title: "Update website content",
    status: "completed" as const,
    priority: "low" as const,
    progress: 100,
    agentAssisted: true,
  },
]

const sampleFiles = [
  {
    id: "1",
    name: "Marketing_Strategy_2023.pdf",
    type: "document" as const,
    size: 2500000,
    lastModified: new Date("2023-07-15"),
    tags: ["Marketing", "Strategy"],
  },
  {
    id: "2",
    name: "Q2_Financial_Report.xlsx",
    type: "spreadsheet" as const,
    size: 1800000,
    lastModified: new Date("2023-07-10"),
    tags: ["Finance", "Report"],
  },
  {
    id: "3",
    name: "Website_Redesign.png",
    type: "image" as const,
    size: 3500000,
    lastModified: new Date("2023-07-05"),
    thumbnail: "/placeholder.svg?height=200&width=200",
    aiGenerated: true,
  },
  {
    id: "4",
    name: "API_Documentation.js",
    type: "code" as const,
    size: 500000,
    lastModified: new Date("2023-07-01"),
    tags: ["Development", "API"],
  },
]

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Marketing Assistant</h1>
            <p className="text-sm text-muted-foreground">
              {t("project.lastUpdated")}:{" "}
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date())}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline">Marketing</Badge>
            <Badge variant="outline">AI Assisted</Badge>
            <Button variant="outline" size="sm">
              {t("project.settings")}
            </Button>
            <Button size="sm">{t("project.share")}</Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="chat" className="data-[state=active]:bg-background">
              {t("project.chat")}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-background">
              {t("project.tasks")}
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-background">
              {t("project.files")}
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-background">
              {t("project.notes")}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full data-[state=active]:flex-1">
            <StreamingChatInterface
              agentName="Marketing Assistant"
              initialMessages={[
                {
                  id: "1",
                  role: "assistant",
                  content:
                    "Hello! I'm your Marketing Assistant. How can I help you with your marketing strategy today?",
                  timestamp: new Date(Date.now() - 3600000),
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="tasks" className="h-full data-[state=active]:flex-1">
            <StructuredTaskInterface tasks={sampleTasks} />
          </TabsContent>

          <TabsContent value="files" className="h-full data-[state=active]:flex-1">
            <FileManagementInterface files={sampleFiles} />
          </TabsContent>

          <TabsContent value="notes" className="h-full data-[state=active]:flex-1">
            <div className="flex h-full items-center justify-center">
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle>{t("project.comingSoon")}</CardTitle>
                  <CardDescription>{t("project.notesFeatureDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>{t("project.notifyMe")}</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
