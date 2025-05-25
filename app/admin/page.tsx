"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  BarChart3,
  Users,
  FileText,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock agent data
const agentSubmissions = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Multilingual customer support agent for Swiss businesses",
    status: "pending",
    submissionDate: new Date(2023, 10, 20),
    lastUpdated: new Date(2023, 10, 20),
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Legal Document Analyzer",
    description: "AI agent for analyzing legal documents in multiple languages",
    status: "approved",
    submissionDate: new Date(2023, 10, 15),
    lastUpdated: new Date(2023, 10, 18),
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Financial Advisor",
    description: "AI agent for financial advice and planning",
    status: "rejected",
    submissionDate: new Date(2023, 10, 10),
    lastUpdated: new Date(2023, 10, 12),
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Translation Assistant",
    description: "AI agent for translating between Swiss national languages",
    status: "pending",
    submissionDate: new Date(2023, 10, 5),
    lastUpdated: new Date(2023, 10, 5),
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Healthcare Assistant",
    description: "AI agent for healthcare providers in Switzerland",
    status: "approved",
    submissionDate: new Date(2023, 9, 28),
    lastUpdated: new Date(2023, 9, 30),
    logo: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  const filteredAgents = agentSubmissions.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === "all" || agent.status === activeTab

    return matchesSearch && matchesTab
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">{t("pending_approval")}</Badge>
      case "approved":
        return <Badge variant="success">{t("approved")}</Badge>
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("admin_dashboard")}</h1>
          <p className="text-gray-500">Manage your AI agents and submissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/agents/new">
            <FileText className="mr-2 h-4 w-4" />
            Submit New Agent
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("manage_agents")}</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("users")}</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+6 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("analytics")}</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Page views this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(new Date())}</div>
            <p className="text-xs text-muted-foreground">Dashboard data refreshed</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">{t("pending_approval")}</TabsTrigger>
                <TabsTrigger value="approved">{t("approved")}</TabsTrigger>
                <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
                <TabsTrigger value="all">{t("all")}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-[250px]"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-2">{t("no_agents_found")}</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={agent.logo || "/placeholder.svg"}
                            alt={agent.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{agent.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell>{formatDate(agent.submissionDate)}</TableCell>
                    <TableCell>{formatDate(agent.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("view_details")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agents/${agent.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("edit")}
                            </Link>
                          </DropdownMenuItem>
                          {agent.status === "pending" && (
                            <>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                {t("approve")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                {t("reject")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
