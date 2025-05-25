"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { allAgents } from "@/data/agents"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import Link from "next/link"
import { Home, Check, ArrowRight } from "lucide-react"

export default function ConciergePage() {
  const { t } = useLanguage()
  const conciergeCompatibleAgents = allAgents.filter((agent) => agent.conciergeCompatible)

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Swiss Concierge</h1>
              <p className="text-xl text-gray-600 mb-6">{t("concierge_description")}</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">{t("download_concierge")}</Button>
                <Button variant="outline" size="lg">
                  {t("learn_more_concierge")}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Swiss Concierge App"
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
        <h2 className="text-2xl font-bold mb-8 text-center">{t("concierge_benefits")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("unified_interface")}</h3>
              <p className="text-gray-600">{t("unified_interface_description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("seamless_integration")}</h3>
              <p className="text-gray-600">{t("seamless_integration_description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("enhanced_security")}</h3>
              <p className="text-gray-600">{t("enhanced_security_description")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compatible Agents Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">{t("compatible_with_concierge")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conciergeCompatibleAgents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/agents/${agent.id}`}>
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={agent.coverImage || "/placeholder.svg?height=160&width=400"}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={agent.logo || "/placeholder.svg"} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div>
                    <Link href={`/agents/${agent.id}`} className="hover:underline">
                      <h3 className="font-semibold">{agent.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">{agent.provider.name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{agent.shortDescription}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {t("connect_to_concierge")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integration Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">{t("how_to_integrate")}</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("integration_step_1_title")}</h3>
                <p className="text-gray-600">{t("integration_step_1_description")}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("integration_step_2_title")}</h3>
                <p className="text-gray-600">{t("integration_step_2_description")}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{t("integration_step_3_title")}</h3>
                <p className="text-gray-600">{t("integration_step_3_description")}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="bg-primary text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("ready_to_get_started")}</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">{t("ready_to_get_started_description")}</p>
          <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary/80" size="lg">
            {t("download_concierge")}
          </Button>
        </div>
      </section>
    </main>
  )
}
