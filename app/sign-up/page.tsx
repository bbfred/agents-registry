"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

export default function SignUpPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: "",
    accountType: "user", // "user" or "provider"
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, accountType: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwords_do_not_match"))
      return
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError(t("password_too_short"))
      return
    }
    
    setLoading(true)
    
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.accountType === "provider" ? "provider" : "user",
        company_name: formData.accountType === "provider" ? formData.companyName : null,
        preferred_language: "en", // You could detect this from browser
      })
      
      // Redirect based on account type
      if (formData.accountType === "provider") {
        router.push("/dashboard")
      } else {
        router.push("/agents")
      }
    } catch (error: any) {
      setError(error.message || t("signup_error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Swiss AI Registry Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl">Swiss AI Registry</span>
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("create_account")}</CardTitle>
          <CardDescription className="text-center">{t("join_swiss_ai_registry")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">{t("first_name")}</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">{t("last_name")}</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("account_type")}</Label>
                <RadioGroup
                  value={formData.accountType}
                  onValueChange={handleRadioChange}
                  className="flex flex-col space-y-1"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="font-normal">
                      {t("looking_for_agents")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="provider" id="provider" />
                    <Label htmlFor="provider" className="font-normal">
                      {t("agent_provider")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.accountType === "provider" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">{t("company_name")}</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyWebsite">{t("company_website")}</Label>
                    <Input
                      id="companyWebsite"
                      name="companyWebsite"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} required />
                <Label htmlFor="terms" className="text-sm font-normal">
                  {t("agree_terms")}
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={!formData.agreeTerms || loading}>
                {loading ? t("creating_account") : t("create_account_button")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            {t("already_have_account")}{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              {t("sign_in")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
