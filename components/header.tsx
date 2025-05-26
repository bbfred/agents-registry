"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu, X, LayoutDashboard, Bot } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { FeatureGate, HideInMVP, FullFeaturesOnly } from "@/components/feature-gate"
import { isFeatureEnabled } from "@/lib/features"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="size-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Swiss AI Registry</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    href="/agents" 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                  >
                    {t("discover_agents")}
                  </Link>
                </NavigationMenuItem>

                <FullFeaturesOnly>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{t("for_businesses")}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/80 to-primary p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <div className="mt-4 mb-2 text-lg font-medium text-white">{t("why_ai_agents")}</div>
                              <p className="text-sm leading-tight text-white/90">{t("learn_how_ai_agents_help")}</p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/use-cases" title={t("use_cases")}>
                          {t("discover_use_cases")}
                        </ListItem>
                        <ListItem href="/implementation" title={t("implementation")}>
                          {t("learn_how_to_implement")}
                        </ListItem>
                        <ListItem href="/success-stories" title={t("success_stories")}>
                          {t("read_success_stories")}
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </FullFeaturesOnly>

                <NavigationMenuItem>
                  <Link 
                    href="/about" 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                  >
                    {t("about_us")}
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link 
                    href="/contact" 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                  >
                    {t("contact")}
                  </Link>
                </NavigationMenuItem>

                <FullFeaturesOnly>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>For Individuals</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px]">
                        <ListItem href="/individuals" title="Personal AI Assistants">
                          AI solutions for your daily life in Switzerland
                        </ListItem>
                        <ListItem href="/individuals#household" title="Smart Home">
                          Household management and automation
                        </ListItem>
                        <ListItem href="/individuals#learning" title="Learning & Skills">
                          Language learning and skill development
                        </ListItem>
                        <ListItem href="/individuals#health" title="Health & Wellness">
                          Personal health and wellness coaching
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </FullFeaturesOnly>

                <FeatureGate feature="dashboard">
                  <NavigationMenuItem>
                    <Link 
                      href="/dashboard" 
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      {t("dashboard")}
                    </Link>
                  </NavigationMenuItem>
                </FeatureGate>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              <FeatureGate feature="multiLanguage">
                <LanguageSwitcher />
              </FeatureGate>
              <FeatureGate feature="authentication">
                <Button variant="outline">{t("sign_in")}</Button>
              </FeatureGate>
              <Link href="/register-agent">
                <Button>{t("register_agent")}</Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <FeatureGate feature="multiLanguage">
              <LanguageSwitcher />
            </FeatureGate>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link href="/agents" className="py-2 px-3 hover:bg-gray-100 rounded-md">
              {t("all_agents")}
            </Link>
            <Link href="/about" className="py-2 px-3 hover:bg-gray-100 rounded-md">
              {t("about_us")}
            </Link>
            <Link href="/contact" className="py-2 px-3 hover:bg-gray-100 rounded-md">
              {t("contact")}
            </Link>
            <FullFeaturesOnly>
              <Link href="/self-hosted" className="py-2 px-3 hover:bg-gray-100 rounded-md">
                {t("self_hosted_agents")}
              </Link>
              <Link href="/concierge" className="py-2 px-3 hover:bg-gray-100 rounded-md">
                {t("concierge_compatible")}
              </Link>
              <Link href="/for-businesses" className="py-2 px-3 hover:bg-gray-100 rounded-md">
                {t("for_businesses")}
              </Link>
              <Link href="/individuals" className="py-2 px-3 hover:bg-gray-100 rounded-md">
                For Individuals
              </Link>
            </FullFeaturesOnly>
            <FeatureGate feature="dashboard">
              <Link href="/dashboard" className="py-2 px-3 hover:bg-gray-100 rounded-md flex items-center">
                <LayoutDashboard className="mr-2 size-4" />
                {t("dashboard")}
              </Link>
            </FeatureGate>
            <div className="pt-4 flex flex-col gap-3">
              <FeatureGate feature="authentication">
                <Button variant="outline" className="w-full">
                  {t("sign_in")}
                </Button>
              </FeatureGate>
              <Link href="/register-agent" className="w-full">
                <Button className="w-full">{t("register_agent")}</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<React.ComponentRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-500">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
