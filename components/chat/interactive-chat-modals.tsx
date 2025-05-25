"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export interface ChatModal {
  id: string
  type: "form" | "multiple-choice" | "file-upload" | "step-process" | "confirmation" | "rating"
  title: string
  description?: string
  data: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

interface InteractiveChatModalProps {
  modal: ChatModal
}

export function InteractiveChatModal({ modal }: InteractiveChatModalProps) {
  const { t } = useLanguage()

  switch (modal.type) {
    case "form":
      return <FormModal modal={modal} />
    case "multiple-choice":
      return <MultipleChoiceModal modal={modal} />
    case "file-upload":
      return <FileUploadModal modal={modal} />
    case "step-process":
      return <StepProcessModal modal={modal} />
    case "confirmation":
      return <ConfirmationModal modal={modal} />
    case "rating":
      return <RatingModal modal={modal} />
    default:
      return null
  }
}

// Form Modal Component
function FormModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    modal.data.fields?.forEach((field: any) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = t("field_required")
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    modal.onSubmit(formData)
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {modal.title}
        </CardTitle>
        {modal.description && <CardDescription>{modal.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {modal.data.fields?.map((field: any) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === "text" && (
              <Input
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => updateField(field.name, e.target.value)}
                className={errors[field.name] ? "border-red-500" : ""}
              />
            )}
            {field.type === "email" && (
              <Input
                id={field.name}
                type="email"
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => updateField(field.name, e.target.value)}
                className={errors[field.name] ? "border-red-500" : ""}
              />
            )}
            {field.type === "textarea" && (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => updateField(field.name, e.target.value)}
                className={errors[field.name] ? "border-red-500" : ""}
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={modal.onCancel} className="flex-1">
          {t("cancel")}
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          {t("submit")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Multiple Choice Modal Component
function MultipleChoiceModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()
  const [selectedValue, setSelectedValue] = useState<string>("")
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSubmit = () => {
    const result = modal.data.multiple ? { selected: selectedValues } : { selected: selectedValue }
    modal.onSubmit(result)
  }

  const toggleMultipleChoice = (value: string) => {
    setSelectedValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{modal.title}</CardTitle>
        {modal.description && <CardDescription>{modal.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {modal.data.multiple ? (
          <div className="space-y-3">
            {modal.data.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={() => toggleMultipleChoice(option.value)}
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
            {modal.data.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={modal.onCancel} className="flex-1">
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={modal.data.multiple ? selectedValues.length === 0 : !selectedValue}
        >
          {t("continue")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// File Upload Modal Component
function FileUploadModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    modal.onSubmit({ files })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {modal.title}
        </CardTitle>
        {modal.description && <CardDescription>{modal.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {t("drag_drop_files")} {t("or")}
          </p>
          <Button variant="outline" asChild>
            <label>
              {t("browse_files")}
              <input
                type="file"
                multiple={modal.data.multiple}
                accept={modal.data.accept}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </Button>
          {modal.data.accept && (
            <p className="text-xs text-gray-500 mt-2">
              {t("accepted_formats")}: {modal.data.accept}
            </p>
          )}
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>{t("selected_files")}:</Label>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={modal.onCancel} className="flex-1">
          {t("cancel")}
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={files.length === 0}>
          {t("upload")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Step Process Modal Component
function StepProcessModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepData, setStepData] = useState<Record<number, any>>({})

  const steps = modal.data.steps || []
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleStepSubmit = (data: any) => {
    setStepData((prev) => ({ ...prev, [currentStep]: data }))

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Final submission
      modal.onSubmit({ steps: stepData, final: data })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{modal.title}</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {t("step")} {currentStep + 1} {t("of")} {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        {currentStepData && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{currentStepData.title}</h3>
              {currentStepData.description && (
                <p className="text-sm text-gray-600 mb-4">{currentStepData.description}</p>
              )}
            </div>

            {/* Render step content based on type */}
            {currentStepData.type === "form" && (
              <StepForm
                fields={currentStepData.fields}
                onSubmit={handleStepSubmit}
                initialData={stepData[currentStep]}
              />
            )}

            {currentStepData.type === "choice" && (
              <StepChoice
                options={currentStepData.options}
                multiple={currentStepData.multiple}
                onSubmit={handleStepSubmit}
                initialData={stepData[currentStep]}
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={currentStep === 0 ? modal.onCancel : handleBack} className="flex-1">
          {currentStep === 0 ? t("cancel") : t("back")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper components for step process
function StepForm({ fields, onSubmit, initialData }: any) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState(initialData || {})

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div className="space-y-4">
      {fields?.map((field: any) => (
        <div key={field.name}>
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
          />
        </div>
      ))}
      <Button onClick={handleSubmit} className="w-full">
        {t("continue")}
      </Button>
    </div>
  )
}

function StepChoice({ options, multiple, onSubmit, initialData }: any) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState(initialData?.selected || (multiple ? [] : ""))

  const handleSubmit = () => {
    onSubmit({ selected })
  }

  return (
    <div className="space-y-4">
      {multiple ? (
        <div className="space-y-2">
          {options?.map((option: any) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelected((prev: string[]) => [...prev, option.value])
                  } else {
                    setSelected((prev: string[]) => prev.filter((v: string) => v !== option.value))
                  }
                }}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
      ) : (
        <RadioGroup value={selected} onValueChange={setSelected}>
          {options?.map((option: any) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
      <Button onClick={handleSubmit} className="w-full" disabled={multiple ? selected.length === 0 : !selected}>
        {t("continue")}
      </Button>
    </div>
  )
}

// Confirmation Modal Component
function ConfirmationModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {modal.title}
        </CardTitle>
        {modal.description && <CardDescription>{modal.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {modal.data.summary && (
          <div className="space-y-2">
            <h4 className="font-medium">{t("summary")}:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {Object.entries(modal.data.summary).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={modal.onCancel} className="flex-1">
          {t("cancel")}
        </Button>
        <Button onClick={() => modal.onSubmit({})} className="flex-1">
          {t("confirm")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Rating Modal Component
function RatingModal({ modal }: { modal: ChatModal }) {
  const { t } = useLanguage()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    modal.onSubmit({ rating, feedback })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{modal.title}</CardTitle>
        {modal.description && <CardDescription>{modal.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t("rating")}:</Label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="feedback">
            {t("feedback")} ({t("optional")}):
          </Label>
          <Textarea
            id="feedback"
            placeholder={t("feedback_placeholder")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={modal.onCancel} className="flex-1">
          {t("skip")}
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={rating === 0}>
          {t("submit")}
        </Button>
      </CardFooter>
    </Card>
  )
}
