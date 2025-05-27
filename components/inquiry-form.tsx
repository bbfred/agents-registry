"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface InquiryFormProps {
  agentId: string
}

export function InquiryForm({ }: InquiryFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    consent: false,
  })

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, consent: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Anfrage gesendet!</h3>
        <p className="text-gray-600 mb-4">
          Vielen Dank für Ihre Anfrage. Der Anbieter wird sich in Kürze bei Ihnen melden.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setFormState({
              name: "",
              email: "",
              company: "",
              message: "",
              consent: false,
            })
            setStatus("idle")
          }}
        >
          Neue Anfrage
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2 mb-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="company">Unternehmen</Label>
          <Input id="company" name="company" value={formState.company} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="message">Nachricht</Label>
          <Textarea id="message" name="message" value={formState.message} onChange={handleChange} rows={4} required />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="consent" checked={formState.consent} onCheckedChange={handleCheckboxChange} required />
          <Label htmlFor="consent" className="text-sm">
            Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage verwendet werden. Weitere Informationen
            finden Sie in unserer Datenschutzerklärung.
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? "Wird gesendet..." : "Anfrage senden"}
        </Button>
      </div>
    </form>
  )
}
