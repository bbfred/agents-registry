'use client'

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { AgentCard } from "@/components/agent-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import type { Agent } from "@/types/agent"

interface AgentsResponse {
  agents: Agent[]
  total: number
  limit: number
  offset: number
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','))
      if (selectedLanguages.length > 0) params.append('languages', selectedLanguages.join(','))
      params.append('limit', '50')
      params.append('offset', '0')

      const response = await fetch(`/api/agents?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      
      const data: AgentsResponse = await response.json()
      setAgents(data.agents || [])
      setTotal(data.total || 0)
      setError(null)
    } catch (err) {
      console.error('Error fetching agents:', err)
      setError('Failed to load agents. Please try again.')
      setAgents([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAgents()
  }, [searchQuery, selectedCategories, selectedLanguages])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (categories: string[], languages: string[]) => {
    setSelectedCategories(categories)
    setSelectedLanguages(languages)
  }

  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (error) {
    return (
      <main className="container mx-auto max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Agents Directory</h1>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAgents}>Retry</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Agents Directory</h1>

      <div className="mb-8">
        <SearchBar 
          className="w-full" 
          onSearch={handleSearch}
          defaultValue={searchQuery}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="hidden md:block">
            <FilterSidebar 
              onFilterChange={handleFilterChange}
              selectedCategories={selectedCategories}
              selectedLanguages={selectedLanguages}
            />
          </div>
          <Button variant="outline" className="w-full md:hidden flex items-center justify-center gap-2 mb-4">
            <Filter className="h-4 w-4" /> Show Filters
          </Button>
        </div>

        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${total} agents found`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                className="border rounded-md px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="rating">Highest Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading agents...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
              
              {sortedAgents.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No agents found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategories([])
                      setSelectedLanguages([])
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
