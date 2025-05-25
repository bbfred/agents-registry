"use client"

import { useState } from "react"
import { Shield, CheckCircle, AlertTriangle, Clock, Eye, Users, Lock, Award } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TrustMetrics {
  overallScore: number
  identityVerification: {
    status: "verified" | "pending" | "failed"
    verifiedAt?: Date
    documents: string[]
  }
  capabilityTesting: {
    score: number
    testsCompleted: number
    totalTests: number
    lastTested: Date
  }
  complianceStatus: {
    fadp: { status: "compliant" | "pending" | "non-compliant"; lastAudit: Date }
    gdpr: { status: "compliant" | "pending" | "non-compliant"; lastAudit: Date }
    iso27001: { status: "compliant" | "pending" | "non-compliant"; lastAudit: Date }
  }
  securityAudit: {
    score: number
    vulnerabilities: { high: number; medium: number; low: number }
    lastAudit: Date
  }
  userFeedback: {
    averageRating: number
    totalReviews: number
    trustRating: number
  }
  transparencyScore: number
}

const sampleTrustData: TrustMetrics = {
  overallScore: 94,
  identityVerification: {
    status: "verified",
    verifiedAt: new Date("2024-01-10"),
    documents: ["Business Registration", "Tax Certificate", "Insurance Certificate"],
  },
  capabilityTesting: {
    score: 92,
    testsCompleted: 47,
    totalTests: 50,
    lastTested: new Date("2024-01-15"),
  },
  complianceStatus: {
    fadp: { status: "compliant", lastAudit: new Date("2024-01-01") },
    gdpr: { status: "compliant", lastAudit: new Date("2024-01-01") },
    iso27001: { status: "pending", lastAudit: new Date("2023-12-15") },
  },
  securityAudit: {
    score: 96,
    vulnerabilities: { high: 0, medium: 2, low: 5 },
    lastAudit: new Date("2024-01-05"),
  },
  userFeedback: {
    averageRating: 4.7,
    totalReviews: 234,
    trustRating: 4.8,
  },
  transparencyScore: 89,
}

export function TrustDashboard({ trustData = sampleTrustData }: { trustData?: TrustMetrics }) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "compliant":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
      case "non-compliant":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trust & Verification Dashboard</h2>
          <p className="text-muted-foreground">Monitor agent trustworthiness and compliance status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-green-500" />
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{trustData.overallScore}/100</div>
            <div className="text-sm text-muted-foreground">Trust Score</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Identity Verification</CardTitle>
                {getStatusIcon(trustData.identityVerification.status)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trustData.identityVerification.status === "verified" ? "Verified" : "Pending"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {trustData.identityVerification.verifiedAt?.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capability Testing</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trustData.capabilityTesting.score}/100</div>
                <p className="text-xs text-muted-foreground">
                  {trustData.capabilityTesting.testsCompleted}/{trustData.capabilityTesting.totalTests} tests passed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trustData.securityAudit.score}/100</div>
                <p className="text-xs text-muted-foreground">
                  {trustData.securityAudit.vulnerabilities.high} high-risk issues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Trust</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trustData.userFeedback.trustRating}/5.0</div>
                <p className="text-xs text-muted-foreground">{trustData.userFeedback.totalReviews} reviews</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trust Score Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of trust components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Identity Verification</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Capability Testing</span>
                  <span>{trustData.capabilityTesting.score}%</span>
                </div>
                <Progress value={trustData.capabilityTesting.score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Security Audit</span>
                  <span>{trustData.securityAudit.score}%</span>
                </div>
                <Progress value={trustData.securityAudit.score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transparency</span>
                  <span>{trustData.transparencyScore}%</span>
                </div>
                <Progress value={trustData.transparencyScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Identity Verification</span>
              </CardTitle>
              <CardDescription>Provider identity and business verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Verification Status</span>
                {getStatusBadge(trustData.identityVerification.status)}
              </div>
              <div className="flex items-center justify-between">
                <span>Verified Date</span>
                <span>{trustData.identityVerification.verifiedAt?.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium">Verified Documents:</span>
                <ul className="mt-2 space-y-1">
                  {trustData.identityVerification.documents.map((doc, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(trustData.complianceStatus).map(([standard, data]) => (
              <Card key={standard}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{standard.toUpperCase()}</span>
                    {getStatusIcon(data.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      {getStatusBadge(data.status)}
                    </div>
                    <div className="flex justify-between">
                      <span>Last Audit</span>
                      <span>{data.lastAudit.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Overall security assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{trustData.securityAudit.score}/100</div>
                <p className="text-sm text-muted-foreground">
                  Last audit: {trustData.securityAudit.lastAudit.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vulnerabilities</CardTitle>
                <CardDescription>Security issues by severity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-600">High Risk</span>
                  <span className="font-bold">{trustData.securityAudit.vulnerabilities.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Medium Risk</span>
                  <span className="font-bold">{trustData.securityAudit.vulnerabilities.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Low Risk</span>
                  <span className="font-bold">{trustData.securityAudit.vulnerabilities.low}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{trustData.userFeedback.averageRating}/5.0</div>
                <p className="text-sm text-muted-foreground">Based on {trustData.userFeedback.totalReviews} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trust Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{trustData.userFeedback.trustRating}/5.0</div>
                <p className="text-sm text-muted-foreground">User trust score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{trustData.userFeedback.totalReviews}</div>
                <p className="text-sm text-muted-foreground">Community feedback</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
