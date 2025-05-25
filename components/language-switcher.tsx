"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-bold" : ""}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("de")}>
          <span className={language === "de" ? "font-bold" : ""}>Deutsch</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>
          <span className={language === "fr" ? "font-bold" : ""}>Français</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("it")}>
          <span className={language === "it" ? "font-bold" : ""}>Italiano</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("rm")}>
          <span className={language === "rm" ? "font-bold" : ""}>Rumantsch</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
