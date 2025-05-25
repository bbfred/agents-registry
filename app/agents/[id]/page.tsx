"use client"

import { Badge } from "@/components/ui/badge"
import { VerificationBadge } from "@/components/verification-badge"
import { AgentSummary } from "@/components/agent-summary"
import { InquiryForm } from "@/components/inquiry-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { allAgents } from "@/data/agents"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Globe, ShieldCheck, Star, Server, Home } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { AgentChatInterface } from "@/components/agent-chat-interface"
import { useState } from "react"
import Link from "next/link"

interface AgentPageProps {
  params: {
    id: string
  }
}

export default function AgentPage({ params }: AgentPageProps) {
  const { t } = useLanguage()
  const [showDemo, setShowDemo] = useState(false)
  const agent = allAgents.find((a) => a.id === params.id)

  if (!agent) {
    notFound()
  }

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-start gap-6 mb-8">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={agent.logo || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <VerificationBadge level={agent.verificationLevel} />
              </div>

              <p className="text-gray-600 mb-3">{agent.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {agent.categories.map((category) => (
                  <Badge key={category} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.selfHosted && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Server className="h-3.5 w-3.5 mr-1" />
                    {t("self_hosted")}
                  </Badge>
                )}
                {agent.conciergeCompatible && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 mr-1" />
                    {t("concierge_compatible")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {agent.selfHosted && agent.demoAvailable && !showDemo && (
            <div className="mb-6">
              <Button onClick={() => setShowDemo(true)}>{t("try_now")}</Button>
            </div>
          )}

          {agent.selfHosted && agent.demoAvailable && showDemo && (
            <div className="mb-6">
              <AgentChatInterface agent={agent} />
            </div>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="capabilities">{t("capabilities")}</TabsTrigger>
              <TabsTrigger value="compatibility">{t("compatibility")}</TabsTrigger>
              {agent.selfHosted && <TabsTrigger value="self-hosted">{t("self_hosted")}</TabsTrigger>}
              {!agent.selfHosted && <TabsTrigger value="integration">{t("integration_guide")}</TabsTrigger>}
              {agent.conciergeCompatible && <TabsTrigger value="concierge">{t("concierge_app")}</TabsTrigger>}
              <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="prose max-w-none">
                <h2>
                  {t("about")} {agent.name}
                </h2>
                <p>{agent.description}</p>

                <h3>{t("ai_summary")}</h3>
                <AgentSummary agent={agent} />

                <h3>{t("supported_languages")}</h3>
                <div className="flex flex-wrap gap-3 my-4">
                  {agent.languages.map((language) => (
                    <div
                      key={language}
                      className="flex items-center gap-1.5 text-sm bg-gray-100 px-3 py-1.5 rounded-full"
                    >
                      <Globe className="h-4 w-4" />
                      {language}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="capabilities">
              <div className="prose max-w-none">
                <h2>{t("capabilities")}</h2>
                <ul>
                  {agent.capabilities.map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="compatibility">
              <div className="prose max-w-none">
                <h2>{t("compatibility")}</h2>
                <h3>{t("integrations")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
                  {agent.integrations.map((integration) => (
                    <div key={integration} className="border rounded-lg p-4 text-center">
                      {integration}
                    </div>
                  ))}
                </div>

                <h3>{t("technical_requirements")}</h3>
                <p>{agent.technicalRequirements}</p>
              </div>
            </TabsContent>

            {agent.selfHosted && (
              <TabsContent value="self-hosted">
                <div className="prose max-w-none">
                  <h2>{t("self_hosted")}</h2>
                  <p>
                    {agent.name} {t("can_be_self_hosted")}. {t("self_hosted_description")}
                  </p>

                  <h3>{t("run_on_platform")}</h3>
                  <p>{t("run_on_platform_description")}</p>
                  {!showDemo && agent.demoAvailable && (
                    <Button onClick={() => setShowDemo(true)} className="mt-2">
                      {t("try_now")}
                    </Button>
                  )}

                  <h3>{t("api_documentation")}</h3>
                  <p>{t("api_documentation_description")}</p>
                  <div className="bg-gray-100 p-4 rounded-md my-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`// Example API call
fetch('https://api.example.com/agents/${agent.id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Your message here'
  })
})`}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            )}

            {!agent.selfHosted && (
              <TabsContent value="integration">
                <div className="prose max-w-none">
                  <h2>{t("integration_guide")}</h2>
                  <p>
                    {agent.name} {t("is_not_self_hosted")}. {t("integration_description")}
                  </p>

                  <h3>{t("implementation_guide")}</h3>
                  <ol>
                    <li>{t("implementation_step_1")}</li>
                    <li>{t("implementation_step_2")}</li>
                    <li>{t("implementation_step_3")}</li>
                    <li>{t("implementation_step_4")}</li>
                  </ol>

                  <h3>{t("api_documentation")}</h3>
                  <p>{t("api_documentation_description")}</p>
                  <div className="bg-gray-100 p-4 rounded-md my-4">
                    <pre className="text-sm overflow-x-auto">
                      <code>
                        {`// Example API call
fetch('https://api.example.com/agents/${agent.id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Your message here'
  })
})`}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            )}

            {agent.conciergeCompatible && (
              <TabsContent value="concierge">
                <div className="prose max-w-none">
                  <h2>{t("concierge_integration")}</h2>
                  <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Swiss Concierge"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Swiss Concierge</h3>
                        <p className="text-gray-600">{t("concierge_description")}</p>
                        <div className="mt-4">
                          <Link href="/concierge">
                            <Button variant="outline">{t("learn_more_concierge")}</Button>
                          </Link>
                          <Button className="ml-3">{t("download_concierge")}</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3>{t("connect_agents_to_concierge")}</h3>
                  <p>
                    {agent.name} {t("is_compatible_with_concierge")}. {t("concierge_compatibility_description")}
                  </p>

                  <h3>{t("concierge_benefits")}</h3>
                  <ul>
                    <li>
                      <strong>{t("benefit_1")}</strong> - {t("benefit_1_description")}
                    </li>
                    <li>
                      <strong>{t("benefit_2")}</strong> - {t("benefit_2_description")}
                    </li>
                    <li>
                      <strong>{t("benefit_3")}</strong> - {t("benefit_3_description")}
                    </li>
                    <li>
                      <strong>{t("benefit_4")}</strong> - {t("benefit_4_description")}
                    </li>
                    <li>
                      <strong>{t("benefit_5")}</strong> - {t("benefit_5_description")}
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Button>{t("connect_to_concierge")}</Button>
                  </div>
                </div>
              </TabsContent>
            )}

            <TabsContent value="reviews">
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="my-0">{t("reviews")}</h2>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {agent.rating}
                  </div>
                </div>

                {agent.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-semibold">{review.author}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <div className="bg-white border rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">{t("contact_provider")}</h2>
            <InquiryForm agentId={agent.id} />

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">{t("provider_info")}</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">{t("company_label")}</div>
                  <div>{agent.provider.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t("location")}</div>
                  <div>{agent.provider.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t("founded")}</div>
                  <div>{agent.provider.founded}</div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">{t("verified_provider")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
