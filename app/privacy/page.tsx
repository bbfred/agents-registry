"use client"

import { useLanguage } from "@/contexts/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("privacy_policy")}</h1>
        <p className="text-gray-600">{t("last_updated")}: January 1, 2024</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("information_we_collect")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("information_collection_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("how_we_use_information")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("information_usage_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("data_sharing")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("data_sharing_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("data_security")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("data_security_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("your_rights")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("user_rights_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("cookies_tracking")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("cookies_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("changes_to_policy")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("policy_changes_text")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("contact_information")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("privacy_contact_text")}</p>
        </section>
      </div>
    </div>
  )
}
