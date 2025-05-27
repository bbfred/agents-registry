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
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignInPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      await signIn(email, password)
      
      // Redirect to dashboard or agents page based on user profile
      // The auth context will handle this
      router.push("/agents")
    } catch (error: any) {
      setError(error.message || t("signin_error"))
    } finally {
      setLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle("user") // Default to user type for social logins
    } catch (error: any) {
      setError(error.message || t("signin_error"))
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
          <CardTitle className="text-2xl font-bold text-center">{t("welcome_back")}</CardTitle>
          <CardDescription className="text-center">{t("sign_in_to_continue")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    {t("forgot_password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
                <Label htmlFor="remember" className="text-sm font-normal">
                  {t("remember_me")}
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("signing_in") : t("sign_in")}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-muted-foreground text-sm">{t("or")}</span>
            </div>
          </div>

          <div className="grid gap-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Globe className="mr-2 h-4 w-4" />
              {t("sign_in_with_google")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            {t("dont_have_account")}{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              {t("sign_up")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
