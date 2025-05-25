"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock blog data (same as in blog/page.tsx)
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI Agents in Swiss Businesses",
    excerpt:
      "Explore how AI agents are transforming business operations across Switzerland and what this means for the future of work.",
    coverImage: "/placeholder.svg?height=400&width=600",
    date: new Date(2023, 10, 15),
    author: "Dr. Markus Weber",
    authorImage: "/placeholder.svg?height=100&width=100",
    readTime: 8,
    category: "Business",
    tags: ["AI", "Business", "Future of Work"],
    content: `
      <p>Artificial Intelligence (AI) agents are rapidly transforming how businesses operate across Switzerland. From customer service to data analysis, these intelligent systems are automating tasks, enhancing decision-making, and creating new opportunities for innovation.</p>
      
      <h2>The Current Landscape</h2>
      
      <p>Swiss businesses across various sectors are increasingly adopting AI agents to streamline operations and improve customer experiences. In the banking sector, institutions like UBS and Credit Suisse are using AI-powered chatbots to handle customer inquiries and provide personalized financial advice. In manufacturing, companies are deploying AI agents to optimize production processes and predict maintenance needs.</p>
      
      <p>According to a recent survey by SwissTech Analytics, 67% of Swiss enterprises with more than 250 employees have implemented some form of AI agent in their operations, with another 22% planning to do so within the next year.</p>
      
      <h2>Key Benefits for Swiss Businesses</h2>
      
      <p>The adoption of AI agents offers several advantages for Swiss businesses:</p>
      
      <ul>
        <li><strong>Multilingual Support:</strong> In a country with four official languages, AI agents that can seamlessly switch between German, French, Italian, and Romansh provide significant value.</li>
        <li><strong>Efficiency Gains:</strong> Automation of routine tasks allows employees to focus on higher-value activities.</li>
        <li><strong>Data-Driven Insights:</strong> AI agents can analyze vast amounts of data to identify patterns and trends that might otherwise go unnoticed.</li>
        <li><strong>24/7 Availability:</strong> Unlike human employees, AI agents can work around the clock, providing continuous service to customers and stakeholders.</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      
      <p>Despite the benefits, businesses face several challenges when implementing AI agents:</p>
      
      <p>Data privacy is a significant concern, especially given Switzerland's strict regulations. Companies must ensure their AI systems comply with the Federal Data Protection Act and, where applicable, the GDPR.</p>
      
      <p>There's also the question of integration with existing systems. Many businesses operate with legacy infrastructure that may not easily connect with modern AI solutions.</p>
      
      <p>Additionally, there's the human factor. Employees may resist the introduction of AI agents due to fears about job security or changes to established workflows.</p>
      
      <h2>The Future Outlook</h2>
      
      <p>Looking ahead, we can expect to see even greater adoption of AI agents across Swiss businesses. As technology advances, these systems will become more sophisticated, capable of handling increasingly complex tasks and making more nuanced decisions.</p>
      
      <p>We're also likely to see more industry-specific AI agents tailored to the unique needs of sectors like healthcare, finance, and manufacturing. These specialized agents will offer deeper domain knowledge and more targeted capabilities.</p>
      
      <p>Furthermore, as the Swiss AI Registry continues to grow, businesses will have access to a wider range of verified, compliant AI agents that meet the country's high standards for quality and data protection.</p>
      
      <h2>Conclusion</h2>
      
      <p>AI agents represent a significant opportunity for Swiss businesses to enhance efficiency, improve customer experiences, and gain competitive advantages. While challenges exist, the potential benefits make this a technology trend that forward-thinking companies cannot afford to ignore.</p>
      
      <p>By carefully selecting the right AI agents, ensuring proper integration, and addressing concerns around data privacy and workforce impact, Swiss businesses can position themselves at the forefront of this technological revolution.</p>
    `,
  },
  // Other blog posts...
]

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { t } = useLanguage()
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Article not found</h2>
          <p className="text-gray-500 mb-4">The article you're looking for could not be found</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back_to_blog")}
          </Link>
        </Button>
      </div>

      <article>
        <div className="mb-6">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={post.authorImage || "/placeholder.svg"} alt={post.author} fill className="object-cover" />
              </div>
              <span>
                {t("by")} {post.author}
              </span>
            </div>
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

        <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
          <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-6">
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </article>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts
            .filter((p) => p.id !== post.id)
            .slice(0, 3)
            .map((relatedPost) => (
              <Card key={relatedPost.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/blog/${relatedPost.id}`}>
                  <div className="relative h-40 bg-gray-100">
                    <Image
                      src={relatedPost.coverImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/blog/${relatedPost.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(relatedPost.date)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </main>
  )
}
