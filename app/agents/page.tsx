import { SearchBar } from "@/components/search-bar"
import { AgentCard } from "@/components/agent-card"
import { FilterSidebar } from "@/components/filter-sidebar"
import { Button } from "@/components/ui/button"
import { allAgents } from "@/data/agents"
import { Filter } from "lucide-react"

export default function AgentsPage() {
  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Agents Directory</h1>

      <div className="mb-8">
        <SearchBar className="w-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="hidden md:block">
            <FilterSidebar />
          </div>
          <Button variant="outline" className="w-full md:hidden flex items-center justify-center gap-2 mb-4">
            <Filter className="h-4 w-4" /> Show Filters
          </Button>
        </div>

        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{allAgents.length} agents found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>Relevance</option>
                <option>Newest</option>
                <option>Highest Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
