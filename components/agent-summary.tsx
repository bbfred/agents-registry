"use client"

import { useState, useEffect } from "react"
import type { Agent } from "@/types/agent"
import { Sparkles } from "lucide-react"

interface AgentSummaryProps {
  agent: Agent
}

export function AgentSummary({ agent }: AgentSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-generated summary
    const generateSummary = async () => {
      setLoading(true)
      // In a real implementation, this would call an API to generate the summary
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSummary(`${agent.name} ist ein KI-Agent, der sich auf ${agent.categories.join(", ")} spezialisiert hat. 
      Der Agent unterstützt ${agent.languages.join(", ")} und bietet Funktionen wie ${agent.capabilities.slice(0, 3).join(", ")} und mehr. 
      Besonders geeignet für Schweizer Unternehmen, die eine Lösung für ${agent.categories[0]} suchen, 
      mit einfacher Integration in ${agent.integrations.slice(0, 2).join(" und ")}.`)

      setLoading(false)
    }

    generateSummary()
  }, [agent])

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-gray-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KI-generiert</span>
          </div>
          <p className="text-gray-700">{summary}</p>
        </>
      )}
    </div>
  )
}
