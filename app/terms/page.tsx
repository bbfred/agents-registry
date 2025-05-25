"use client"

import { useLanguage } from "@/contexts/language-context"

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("terms_of_service")}</h1>
        <p className="text-gray-600">{t("last_updated")}: January 1, 2024</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("acceptance_of_terms")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("terms_acceptance_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("description_of_service")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("service_description_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("user_accounts")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("user_accounts_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("agent_listings")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("agent_listings_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("prohibited_uses")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("prohibited_uses_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("intellectual_property")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("intellectual_property_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("limitation_of_liability")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("limitation_liability_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("governing_law")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("governing_law_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("contact_information")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("terms_contact_text")}</p>
        </section>
      </div>
    </div>
  )
}
