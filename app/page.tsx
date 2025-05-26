import { SearchBar } from "@/components/search-bar"
import { AgentCard } from "@/components/agent-card"
import { VerificationLegend } from "@/components/verification-legend"
import { Button } from "@/components/ui/button"
import { ChevronRight, Shield, Globe, Sparkles } from "lucide-react"
import { featuredAgents } from "@/data/agents"
import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import { FeatureGate } from "@/components/feature-gate"

export default function Home() {
  
  return (
    <PageWrapper>
      {({ t }) => (
        <main className="flex min-h-screen flex-col">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">{t("hero_title")}</h1>
                <p className="text-xl text-gray-600 max-w-3xl mb-8">{t("hero_subtitle")}</p>
                <SearchBar className="w-full max-w-2xl" />
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Button variant="outline" size="sm">
                    {t("customer_service")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("legal_advice")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("technical_support")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("translation")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("data_analysis")}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Agents */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t("featured_agents")}</h2>
                <Link href="/agents" className="text-primary hover:text-primary/80 flex items-center">
                  {t("show_all")} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </section>

          {/* Trust & Verification */}
          <section className="bg-gray-50 py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("verification_system")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("identity_verification")}</h3>
                  <p className="text-gray-600">{t("identity_verification_desc")}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("capability_verification")}</h3>
                  <p className="text-gray-600">{t("capability_verification_desc")}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("swiss_compliance")}</h3>
                  <p className="text-gray-600">{t("swiss_compliance_desc")}</p>
                </div>
              </div>

              <VerificationLegend />
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="bg-primary text-white rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("are_you_provider")}</h2>
                  <p className="text-white/90 max-w-xl">{t("register_cta")}</p>
                </div>
                <Link href="/register-agent">
                  <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary/80 whitespace-nowrap">
                    {t("register_agent")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}
    </PageWrapper>
  )
}
