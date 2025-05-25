"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Book, Video, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  const { t } = useLanguage()

  const supportCategories = [
    {
      title: t("getting_started"),
      description: t("getting_started_description"),
      icon: Book,
      articles: [
        { title: t("how_to_create_account"), href: "/support/create-account" },
        { title: t("finding_right_agent"), href: "/support/finding-agents" },
        { title: t("setting_up_first_project"), href: "/support/first-project" },
      ],
    },
    {
      title: t("agent_integration"),
      description: t("agent_integration_description"),
      icon: MessageCircle,
      articles: [
        { title: t("connecting_agents"), href: "/support/connecting-agents" },
        { title: t("api_documentation"), href: "/support/api-docs" },
        { title: t("troubleshooting_integration"), href: "/support/troubleshooting" },
      ],
    },
    {
      title: t("billing_payments"),
      description: t("billing_payments_description"),
      icon: Download,
      articles: [
        { title: t("understanding_pricing"), href: "/support/pricing" },
        { title: t("managing_subscription"), href: "/support/subscription" },
        { title: t("payment_methods"), href: "/support/payments" },
      ],
    },
  ]

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("support_center")}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("support_center_description")}</p>
      </div>

      {/* Search */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input placeholder={t("search_support_articles")} className="pl-10 py-6 text-lg" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("live_chat")}</h3>
            <p className="text-gray-600 mb-4">{t("live_chat_description")}</p>
            <Button>{t("start_chat")}</Button>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Video className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("video_tutorials")}</h3>
            <p className="text-gray-600 mb-4">{t("video_tutorials_description")}</p>
            <Button variant="outline">{t("watch_tutorials")}</Button>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("download_guides")}</h3>
            <p className="text-gray-600 mb-4">{t("download_guides_description")}</p>
            <Button variant="outline">{t("download_now")}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Support Categories */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">{t("browse_by_category")}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {supportCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <Link
                      key={article.title}
                      href={article.href}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm">{article.title}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">{t("popular_articles")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("how_to_verify_agent")}</CardTitle>
                <Badge variant="secondary">{t("popular")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t("agent_verification_description")}</p>
              <Button variant="outline" size="sm">
                {t("read_article")}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("understanding_pricing_models")}</CardTitle>
                <Badge variant="secondary">{t("popular")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t("pricing_models_description")}</p>
              <Button variant="outline" size="sm">
                {t("read_article")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("still_need_help")}</CardTitle>
            <CardDescription>{t("contact_support_team")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">{t("contact_support")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">{t("view_faq")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
