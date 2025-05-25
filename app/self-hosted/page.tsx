"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { allAgents } from "@/data/agents"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { Server, Database, Shield } from "lucide-react"
import { AgentCard } from "@/components/agent-card"

export default function SelfHostedPage() {
  const { t } = useLanguage()
  const selfHostedAgents = allAgents.filter((agent) => agent.selfHosted)

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("self_hosted_agents")}</h1>
              <p className="text-xl text-gray-600 mb-6">{t("self_hosted_description")}</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">{t("explore_agents")}</Button>
                <Button variant="outline" size="lg">
                  {t("learn_more")}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Self-hosted Agents"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">{t("self_hosted_benefits")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("self_hosted_benefit_1_title")}</h3>
              <p className="text-gray-600">{t("self_hosted_benefit_1_description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("self_hosted_benefit_2_title")}</h3>
              <p className="text-gray-600">{t("self_hosted_benefit_2_description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("self_hosted_benefit_3_title")}</h3>
              <p className="text-gray-600">{t("self_hosted_benefit_3_description")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Self-hosted Agents Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">{t("available_self_hosted_agents")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selfHostedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">{t("how_self_hosting_works")}</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("self_hosting_step_1_title")}</h3>
                <p className="text-gray-600">{t("self_hosting_step_1_description")}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("self_hosting_step_2_title")}</h3>
                <p className="text-gray-600">{t("self_hosting_step_2_description")}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("self_hosting_step_3_title")}</h3>
                <p className="text-gray-600">{t("self_hosting_step_3_description")}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="bg-primary text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("ready_to_self_host")}</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">{t("ready_to_self_host_description")}</p>
          <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary/80" size="lg">
            {t("get_started_now")}
          </Button>
        </div>
      </section>
    </main>
  )
}
