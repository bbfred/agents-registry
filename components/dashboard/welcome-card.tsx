"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function WelcomeCard() {
  const { t } = useLanguage()

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>{t("welcome_to_your_agents")}</CardTitle>
        <CardDescription>{t("welcome_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/agents">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("add_new_agent")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
