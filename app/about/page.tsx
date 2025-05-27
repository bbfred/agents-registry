"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock team data
const teamMembers = [
  {
    name: "Dr. Sarah Müller",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Former AI research lead at ETH Zurich with over 15 years of experience in artificial intelligence and machine learning.",
  },
  {
    name: "Thomas Weber",
    role: "CTO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Previously led engineering teams at Google Switzerland and has extensive experience in building scalable AI platforms.",
  },
  {
    name: "Marie Dubois",
    role: "Head of Verification",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Expert in AI safety and ethics with a background in regulatory compliance for technology companies.",
  },
  {
    name: "Marco Rossi",
    role: "Head of Partnerships",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Experienced business development professional with a strong network in the Swiss technology ecosystem.",
  },
]

// Mock partner data
const partners = [
  {
    name: "ETH Zurich",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Academic",
  },
  {
    name: "Swiss Digital Initiative",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Non-profit",
  },
  {
    name: "Digitalswitzerland",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Industry",
  },
  {
    name: "EPFL",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Academic",
  },
  {
    name: "Swiss AI Association",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Non-profit",
  },
  {
    name: "Federal Office for Communications",
    logo: "/placeholder.svg?height=100&width=200",
    type: "Government",
  },
]

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About Swiss AI Registry</h1>
            <p className="text-xl text-gray-600 mb-6">
              We&apos;re building the trusted platform for AI agents in Switzerland, ensuring quality, compliance, and
              accessibility for all.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Swiss AI Registry Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t("our_mission")}</h2>
              <p className="text-gray-600">
                Our mission is to create a trusted ecosystem for AI agents in Switzerland by providing a comprehensive
                registry that verifies, catalogs, and makes accessible high-quality AI agents that comply with Swiss
                standards and regulations.
              </p>
              <p className="text-gray-600 mt-4">
                We aim to bridge the gap between AI agent providers and users, ensuring transparency, quality, and
                compliance while fostering innovation in the Swiss AI landscape.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t("our_vision")}</h2>
              <p className="text-gray-600">
                We envision a future where AI agents are seamlessly integrated into Swiss businesses and households,
                enhancing productivity, creativity, and quality of life while upholding Swiss values of privacy,
                security, and reliability.
              </p>
              <p className="text-gray-600 mt-4">
                By 2030, we aim to make Switzerland a global leader in responsible AI agent adoption, with the Swiss AI
                Registry serving as the gold standard for AI agent verification and distribution.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("our_story")}</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-gray-600 mb-4">
            The Swiss AI Registry was founded in 2022 by a team of AI researchers, engineers, and business professionals
            who recognized the growing importance of AI agents in the Swiss economy and society.
          </p>
          <p className="text-gray-600 mb-4">
            As AI agents became more prevalent, we observed a lack of standards, verification processes, and centralized
            resources for finding reliable, compliant AI solutions tailored to Swiss needs. This gap led to uncertainty
            for businesses and individuals looking to adopt AI technology.
          </p>
          <p className="text-gray-600 mb-4">
            We established the Swiss AI Registry to address these challenges, creating a platform that not only lists AI
            agents but verifies their capabilities, ensures their compliance with Swiss regulations, and makes them
            accessible to all Swiss businesses and individuals regardless of technical expertise.
          </p>
          <p className="text-gray-600">
            Today, we continue to grow our registry, expand our verification processes, and build partnerships across
            the Swiss AI ecosystem to fulfill our mission of creating a trusted AI agent marketplace for Switzerland.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in creating a transparent ecosystem where users can trust the AI agents they adopt, with
                clear information about capabilities, limitations, and data practices.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Swiss-Centric Approach</h3>
              <p className="text-gray-600">
                We focus on the unique needs of the Swiss market, including multilingual support, compliance with Swiss
                regulations, and alignment with Swiss business practices and cultural values.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation & Quality</h3>
              <p className="text-gray-600">
                We promote innovation in the AI agent space while maintaining high standards for quality, reliability,
                and user experience, ensuring that listed agents deliver real value.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("our_team")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="relative h-64">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("our_partners")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center">
              <div className="relative h-20 w-full mb-2">
                <Image src={partner.logo || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
              </div>
              <p className="font-medium text-center">{partner.name}</p>
              <Badge variant="outline" className="mt-1">
                {partner.type}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Join Our Team */}
      <section className="mb-16">
        <div className="bg-primary text-white rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("join_our_team")}</h2>
              <p className="text-white/90 max-w-xl">
                We&apos;re always looking for talented individuals who are passionate about AI, technology, and creating
                positive impact. Join us in building the future of AI in Switzerland.
              </p>
            </div>
            <Button className="bg-white text-primary hover:bg-gray-100 hover:text-primary/80 whitespace-nowrap">
              <Link href="/careers">{t("view_open_positions")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
