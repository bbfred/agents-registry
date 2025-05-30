"use client"

import { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle, Edit, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock agent data (same as in admin/page.tsx)
const agentSubmissions = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Multilingual customer support agent for Swiss businesses",
    status: "pending",
    submissionDate: new Date(2023, 10, 20),
    lastUpdated: new Date(2023, 10, 20),
    logo: "/placeholder.svg?height=40&width=40",
    coverImage: "/placeholder.svg?height=200&width=400",
    provider: {
      name: "AI Solutions GmbH",
      email: "contact@aisolutions.ch",
      website: "https://aisolutions.ch",
    },
    capabilities: [
      "Multilingual support (DE, FR, IT, EN)",
      "24/7 availability",
      "Integration with CRM systems",
      "Personalized responses",
      "Ticket creation and management",
    ],
    technicalDetails: {
      apiEndpoint: "https://api.aisolutions.ch/customer-support",
      documentation: "https://docs.aisolutions.ch/customer-support",
      selfHosted: true,
      conciergeCompatible: true,
    },
    reviewNotes: "",
  },
  // Other agent submissions...
]

interface AgentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  return <AgentDetailClient id={id} />
}

function AgentDetailClient({ id }: { id: string }) {
  const { t } = useLanguage()
  const agent = agentSubmissions.find((a) => a.id === id)

  if (!agent) {
    return (
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">{t("agent_not_found")}</h2>
          <p className="text-gray-500 mb-4">The agent you&apos;re looking for could not be found</p>
          <Button asChild>
            <Link href="/admin">{t("back_to_dashboard")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">{t("pending_approval")}</Badge>
      case "approved":
        return <Badge variant="default">{t("approved")}</Badge>
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{t("agent_details")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image src={agent.logo || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <p className="text-gray-500">{agent.description}</p>
                    <div className="mt-2">{getStatusBadge(agent.status)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/agents/${agent.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t("edit")}
                    </Link>
                  </Button>
                  {agent.status === "pending" && (
                    <>
                      <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t("approve")}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        {t("reject")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-[200px] rounded-lg overflow-hidden mb-6">
                <Image src={agent.coverImage || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
              </div>

              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Provider Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p>{agent.provider.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{agent.provider.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <p>
                            <a
                              href={agent.provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {agent.provider.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Submission Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">{t("submission_date")}</p>
                          <p>{formatDate(agent.submissionDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t("last_updated")}</p>
                          <p>{formatDate(agent.lastUpdated)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t("status")}</p>
                          <p>{getStatusBadge(agent.status)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="capabilities">
                  <h3 className="font-semibold mb-2">Agent Capabilities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {agent.capabilities.map((capability, index) => (
                      <li key={index}>{capability}</li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="technical">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Technical Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">API Endpoint</p>
                          <p className="font-mono text-sm">{agent.technicalDetails.apiEndpoint}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Documentation</p>
                          <p>
                            <a
                              href={agent.technicalDetails.documentation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Documentation
                            </a>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Self-Hosted</p>
                          <p>{agent.technicalDetails.selfHosted ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Concierge Compatible</p>
                          <p>{agent.technicalDetails.conciergeCompatible ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("verification_status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-1 ${agent.status === "approved" ? "bg-green-100" : agent.status === "rejected" ? "bg-red-100" : "bg-yellow-100"}`}
                  >
                    {agent.status === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : agent.status === "rejected" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {agent.status === "approved"
                        ? "Approved"
                        : agent.status === "rejected"
                          ? "Rejected"
                          : "Pending Approval"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {agent.status === "approved"
                        ? "This agent has been approved and is listed in the registry."
                        : agent.status === "rejected"
                          ? "This agent has been rejected and is not listed in the registry."
                          : "This agent is awaiting review and approval."}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">{t("review_notes")}</h3>
                  <Textarea placeholder="Add notes about this agent submission..." value={agent.reviewNotes} rows={6} />
                  <Button className="mt-2 w-full">{t("save_changes")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-px flex-1 bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Agent Submitted</p>
                    <p className="text-sm text-gray-500">{formatDate(agent.submissionDate)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-px flex-1 bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Initial Review</p>
                    <p className="text-sm text-gray-500">
                      {new Date() > agent.submissionDate
                        ? formatDate(new Date(agent.submissionDate.getTime() + 24 * 60 * 60 * 1000))
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-1 ${
                        agent.status === "approved"
                          ? "bg-green-100"
                          : agent.status === "rejected"
                            ? "bg-red-100"
                            : "bg-gray-100"
                      }`}
                    >
                      {agent.status === "approved" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : agent.status === "rejected" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Final Decision</p>
                    <p className="text-sm text-gray-500">
                      {agent.status === "approved" || agent.status === "rejected"
                        ? formatDate(agent.lastUpdated)
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
