'use client'

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { AgentCard } from "@/components/agent-card"
import { AgentCardSkeleton } from "@/components/ui/agent-card-skeleton"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { Agent } from "@/types/agent"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AgentsResponse {
  agents: Agent[]
  total: number
  limit: number
  offset: number
}

const ITEMS_PER_PAGE = 6

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','))
      if (selectedLanguages.length > 0) params.append('languages', selectedLanguages.join(','))
      
      const offset = (currentPage - 1) * ITEMS_PER_PAGE
      params.append('limit', ITEMS_PER_PAGE.toString())
      params.append('offset', offset.toString())

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories, selectedLanguages])

  // Fetch agents when page or filters change
  useEffect(() => {
    fetchAgents()
  }, [currentPage, searchQuery, selectedCategories, selectedLanguages])

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

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const generatePaginationItems = () => {
    const items = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(1)
            }}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(i)
              }}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(totalPages)
            }}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return items
  }

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
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Agents</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <AgentCardSkeleton key={i} />
              ))}
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

          {/* Pagination */}
          {!loading && sortedAgents.length > 0 && total > ITEMS_PER_PAGE && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(prev => Math.max(1, prev - 1))
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(prev => Math.min(totalPages, prev + 1))
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
