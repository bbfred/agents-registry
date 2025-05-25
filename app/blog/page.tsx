"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock blog data
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI Agents in Swiss Businesses",
    excerpt:
      "Explore how AI agents are transforming business operations across Switzerland and what this means for the future of work.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 10, 15),
    author: "Dr. Markus Weber",
    readTime: 8,
    category: "Business",
    tags: ["AI", "Business", "Future of Work"],
  },
  {
    id: "2",
    title: "Understanding AI Agent Verification Standards",
    excerpt:
      "A deep dive into the verification standards that ensure AI agents are safe, reliable, and compliant with Swiss regulations.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 10, 10),
    author: "Sophia Müller",
    readTime: 6,
    category: "Technology",
    tags: ["Verification", "Standards", "Compliance"],
  },
  {
    id: "3",
    title: "Self-Hosted vs. Cloud-Based AI Agents: Pros and Cons",
    excerpt:
      "Comparing the benefits and drawbacks of self-hosted and cloud-based AI agents for different use cases and business sizes.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 10, 5),
    author: "Thomas Keller",
    readTime: 7,
    category: "Technology",
    tags: ["Self-Hosted", "Cloud", "Comparison"],
  },
  {
    id: "4",
    title: "How Swiss Concierge is Changing Home Automation",
    excerpt:
      "Discover how the Swiss Concierge platform is revolutionizing home automation with its integrated AI agent approach.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 9, 28),
    author: "Laura Blanc",
    readTime: 5,
    category: "Home",
    tags: ["Concierge", "Automation", "Smart Home"],
  },
  {
    id: "5",
    title: "The Role of AI in Swiss Healthcare Systems",
    excerpt:
      "An examination of how AI agents are being integrated into Swiss healthcare systems to improve patient care and outcomes.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 9, 20),
    author: "Dr. Anna Schmid",
    readTime: 9,
    category: "Healthcare",
    tags: ["Healthcare", "Medical", "Patient Care"],
  },
  {
    id: "6",
    title: "Multilingual AI Agents: Breaking Language Barriers in Switzerland",
    excerpt:
      "How multilingual AI agents are addressing the unique language diversity challenges in Switzerland's business landscape.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 9, 15),
    author: "Jean-Pierre Dubois",
    readTime: 6,
    category: "Language",
    tags: ["Multilingual", "Translation", "Communication"],
  },
]

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Business", count: blogPosts.filter((post) => post.category === "Business").length },
  { name: "Technology", count: blogPosts.filter((post) => post.category === "Technology").length },
  { name: "Healthcare", count: blogPosts.filter((post) => post.category === "Healthcare").length },
  { name: "Home", count: blogPosts.filter((post) => post.category === "Home").length },
  { name: "Language", count: blogPosts.filter((post) => post.category === "Language").length },
]

export default function BlogPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("latest_articles")}</h1>
        <p className="text-gray-600 mb-6">
          Stay updated with the latest news, insights, and developments in the Swiss AI ecosystem.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("search_articles")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48 bg-gray-100">
                  <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge>{post.category}</Badge>
                  </div>
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/blog/${post.id}`}>
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{post.title}</h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {post.readTime} {t("min_read")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>
                    {t("by")} {post.author}
                  </span>
                </div>
                <div className="mt-4">
                  <Link href={`/blog/${post.id}`} className="text-primary hover:text-primary/80 flex items-center">
                    {t("read_more")} <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{t("popular_topics")}</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            {t("artificial_intelligence")}
          </Button>
          <Button variant="outline" size="sm">
            {t("machine_learning")}
          </Button>
          <Button variant="outline" size="sm">
            {t("natural_language_processing")}
          </Button>
          <Button variant="outline" size="sm">
            {t("swiss_ai_ecosystem")}
          </Button>
          <Button variant="outline" size="sm">
            Self-Hosted AI
          </Button>
          <Button variant="outline" size="sm">
            Swiss Concierge
          </Button>
          <Button variant="outline" size="sm">
            AI Regulation
          </Button>
          <Button variant="outline" size="sm">
            AI Ethics
          </Button>
        </div>
      </div>
    </main>
  )
}
