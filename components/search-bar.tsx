"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface SearchBarProps {
  className?: string
  onSearch?: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ className, onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    // Trigger search on input change with debouncing
    if (onSearch) {
      const timeoutId = setTimeout(() => onSearch(value), 300)
      return () => clearTimeout(timeoutId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={t("search_placeholder")}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-24 py-6 w-full rounded-full border-gray-300 focus:border-primary focus:ring-primary"
        />
        <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full">
          {t("search_button")}
        </Button>
      </div>
    </form>
  )
}
