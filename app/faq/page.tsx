"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle } from "lucide-react"
import Link from "next/link"

// Mock FAQ data
const faqData = {
  general: [
    {
      question: "What is the Swiss AI Registry?",
      answer:
        "The Swiss AI Registry is a platform that catalogs, verifies, and provides access to AI agents specifically designed for Swiss businesses and individuals. It ensures that all listed agents comply with Swiss regulations and meet quality standards.",
    },
    {
      question: "How do I find the right AI agent for my needs?",
      answer:
        "You can use our search function to find agents based on capabilities, categories, or specific use cases. You can also filter by verification level, language support, and other criteria to narrow down your options.",
    },
    {
      question: "Are all agents on the registry verified?",
      answer:
        "All agents undergo a basic verification process before being listed. However, there are different verification levels (Basic, Verified, and Certified) that indicate the extent of testing and verification an agent has undergone.",
    },
    {
      question: "What languages are supported?",
      answer:
        "The Swiss AI Registry supports all four national languages of Switzerland (German, French, Italian, and Romansh) as well as English. Individual agents may support different combinations of these languages.",
    },
    {
      question: "Is the Swiss AI Registry free to use?",
      answer:
        "Yes, browsing and searching the registry is free. However, individual agents may have their own pricing models, which are clearly indicated on their listing pages.",
    },
  ],
  agents: [
    {
      question: "What is the difference between self-hosted and cloud-based agents?",
      answer:
        "Self-hosted agents can be deployed on your own infrastructure, giving you more control over data and privacy. Cloud-based agents are hosted by the provider and accessed via API, requiring less technical setup but potentially raising data sovereignty concerns.",
    },
    {
      question: "Can I try an agent before committing to it?",
      answer:
        "Many agents offer demo versions or trial periods. Look for the 'Try Now' button on agent listings that support this feature.",
    },
    {
      question: "What is Swiss Concierge compatibility?",
      answer:
        "Agents marked as 'Concierge Compatible' can be integrated with the Swiss Concierge platform, which provides a unified interface for managing multiple AI agents.",
    },
    {
      question: "How do I integrate an agent with my existing systems?",
      answer:
        "Each agent provides integration documentation on their detail page. This typically includes API endpoints, authentication methods, and code examples for common programming languages.",
    },
    {
      question: "What happens if an agent doesn't perform as expected?",
      answer:
        "You should first contact the agent provider directly. If issues persist, you can report the problem to the Swiss AI Registry, which may affect the agent's verification status.",
    },
  ],
  providers: [
    {
      question: "How do I register my AI agent on the registry?",
      answer:
        "You need to create an account as an agent provider, then submit your agent for review. The submission process includes providing technical documentation, capability descriptions, and compliance information.",
    },
    {
      question: "What are the requirements for listing an agent?",
      answer:
        "Agents must meet basic functionality requirements, comply with Swiss data protection regulations, and provide clear documentation. Higher verification levels have additional requirements.",
    },
    {
      question: "How long does the verification process take?",
      answer:
        "Basic verification typically takes 3-5 business days. Verified and Certified levels require more extensive testing and can take 2-4 weeks depending on the complexity of the agent.",
    },
    {
      question: "Are there fees for listing an agent?",
      answer:
        "Basic listing is free. Verified and Certified verification levels have associated fees to cover the cost of more extensive testing and ongoing compliance monitoring.",
    },
    {
      question: "Can I update my agent listing after it's approved?",
      answer:
        "Yes, you can update your agent's information, capabilities, and integration details. Significant changes may require re-verification, especially for Verified and Certified agents.",
    },
  ],
  technical: [
    {
      question: "What technical standards do agents need to meet?",
      answer:
        "Agents should provide RESTful APIs with clear documentation, support secure authentication methods, and follow Swiss data protection guidelines. Specific technical requirements vary by agent type and verification level.",
    },
    {
      question: "How is data privacy ensured?",
      answer:
        "All agents must comply with the Swiss Federal Data Protection Act. Self-hosted agents give you full control over your data. For cloud-based agents, providers must disclose their data handling practices and storage locations.",
    },
    {
      question: "What authentication methods are supported?",
      answer:
        "Most agents support API key authentication. Some also offer OAuth 2.0, JWT, or other authentication methods. The supported methods are listed on each agent's detail page.",
    },
    {
      question: "Can agents be used in offline environments?",
      answer:
        "Self-hosted agents can typically be configured for offline use, though some features may be limited. Cloud-based agents require internet connectivity.",
    },
    {
      question: "What happens if an agent's API changes?",
      answer:
        "Providers are required to maintain backward compatibility or provide adequate notice before making breaking changes. Version information and deprecation policies are included in agent listings.",
    },
  ],
}

export default function FAQPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // Filter FAQs based on search query
  const allFaqs = [
    ...faqData.general.map((faq) => ({ ...faq, category: "general" })),
    ...faqData.agents.map((faq) => ({ ...faq, category: "agents" })),
    ...faqData.providers.map((faq) => ({ ...faq, category: "providers" })),
    ...faqData.technical.map((faq) => ({ ...faq, category: "technical" })),
  ]

  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">{t("frequently_asked_questions")}</h1>
      <p className="text-gray-600 mb-8 text-center">Find answers to common questions about the Swiss AI Registry</p>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search for questions or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>

      {searchQuery ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 bg-muted/40 rounded-lg">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">Try different keywords or browse our FAQ categories below</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`search-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general">{t("general_questions")}</TabsTrigger>
            <TabsTrigger value="agents">{t("agent_questions")}</TabsTrigger>
            <TabsTrigger value="providers">{t("provider_questions")}</TabsTrigger>
            <TabsTrigger value="technical">{t("technical_questions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Accordion type="single" collapsible className="w-full">
              {faqData.general.map((faq, index) => (
                <AccordionItem key={index} value={`general-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="agents">
            <Accordion type="single" collapsible className="w-full">
              {faqData.agents.map((faq, index) => (
                <AccordionItem key={index} value={`agents-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="providers">
            <Accordion type="single" collapsible className="w-full">
              {faqData.providers.map((faq, index) => (
                <AccordionItem key={index} value={`providers-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="technical">
            <Accordion type="single" collapsible className="w-full">
              {faqData.technical.map((faq, index) => (
                <AccordionItem key={index} value={`technical-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-12 text-center py-8 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{t("cant_find_answer")}</h2>
        <p className="text-gray-600 mb-4">Our support team is here to help with any questions you may have.</p>
        <Button asChild>
          <Link href="/contact">{t("contact_support")}</Link>
        </Button>
      </div>
    </main>
  )
}
