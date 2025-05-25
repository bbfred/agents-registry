"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentComparison } from "@/components/agent-discovery/agent-comparison"
import { TrustDashboard } from "@/components/trust/trust-dashboard"
import { SwissIntegrationWizard } from "@/components/integration/swiss-integration-wizard"

export default function AdvancedDemoPage() {
  const [activeTab, setActiveTab] = useState("comparison")

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Advanced Swiss AI Components</h1>
        <p className="text-muted-foreground mt-2">
          Explore advanced components for agent discovery, trust management, and Swiss business integration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Agent Comparison</TabsTrigger>
          <TabsTrigger value="trust">Trust Dashboard</TabsTrigger>
          <TabsTrigger value="integration">Integration Wizard</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Comparison Interface</CardTitle>
              <CardDescription>
                Compare multiple AI agents side-by-side with Swiss-specific criteria including trust scores, compliance
                status, and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Side-by-side comparison</li>
                      <li>• Swiss compliance indicators</li>
                      <li>• Trust score visualization</li>
                      <li>• Performance metrics</li>
                      <li>• Pricing comparison</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Swiss-Specific:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• FADP compliance status</li>
                      <li>• Swiss language support</li>
                      <li>• Cultural context awareness</li>
                      <li>• Local business integration</li>
                      <li>• Data residency options</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Use Cases:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Agent selection process</li>
                      <li>• Vendor evaluation</li>
                      <li>• Compliance assessment</li>
                      <li>• Cost-benefit analysis</li>
                      <li>• Feature comparison</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg p-6">
            <AgentComparison />
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust & Verification Dashboard</CardTitle>
              <CardDescription>
                Comprehensive trust monitoring system with Swiss regulatory compliance tracking, security audits, and
                transparency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Trust Components:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Identity verification</li>
                      <li>• Capability testing</li>
                      <li>• Security audits</li>
                      <li>• User feedback</li>
                      <li>• Transparency score</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Compliance Tracking:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• FADP compliance</li>
                      <li>• GDPR compliance</li>
                      <li>• ISO 27001 certification</li>
                      <li>• FINMA regulations</li>
                      <li>• Audit trail</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Monitoring:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Real-time status</li>
                      <li>• Vulnerability tracking</li>
                      <li>• Performance metrics</li>
                      <li>• User trust ratings</li>
                      <li>• Compliance alerts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg p-6">
            <TrustDashboard />
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Swiss Business Integration Wizard</CardTitle>
              <CardDescription>
                Step-by-step wizard for configuring AI agents with Swiss business requirements, compliance standards,
                and system integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Configuration Steps:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Business information</li>
                      <li>• Compliance requirements</li>
                      <li>• System integration</li>
                      <li>• Agent configuration</li>
                      <li>• Deployment setup</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Swiss Features:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Canton-specific settings</li>
                      <li>• Multi-language support</li>
                      <li>• Cultural context options</li>
                      <li>• Regulatory compliance</li>
                      <li>• Data residency controls</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Integrations:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• CRM systems</li>
                      <li>• ERP platforms</li>
                      <li>• Communication tools</li>
                      <li>• API endpoints</li>
                      <li>• Webhook configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg p-6">
            <SwissIntegrationWizard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
