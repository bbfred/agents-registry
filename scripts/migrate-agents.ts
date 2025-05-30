import { createClient } from '@supabase/supabase-js'
import { featuredAgents } from '../data/agents'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing from .env.local')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing from .env.local')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('📡 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('🔑 Service key loaded:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No')

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for full access
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function migrateAgents() {
  console.log('🚀 Starting agent data migration...')
  
  try {
    // First, get or create categories
    const categoryMap = new Map<string, string>()
    
    for (const agent of featuredAgents) {
      for (const category of agent.categories) {
        if (!categoryMap.has(category)) {
          // Check if category exists
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single()
          
          if (existingCategory) {
            categoryMap.set(category, existingCategory.id)
          } else {
            // Create new category
            const { data: newCategory, error } = await supabase
              .from('categories')
              .insert({
                slug: category,
                name: { en: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                display_order: categoryMap.size + 1
              })
              .select('id')
              .single()
            
            if (error) {
              console.error(`Failed to create category ${category}:`, error)
            } else {
              categoryMap.set(category, newCategory.id)
              console.log(`✅ Created category: ${category}`)
            }
          }
        }
      }
    }

    // Now migrate agents
    for (const agent of featuredAgents) {
      console.log(`📦 Migrating agent: ${agent.name}`)
      
      // Map verification levels
      const verificationLevelMap: Record<string, string> = {
        'basic': 'basic',
        'verified': 'verified', 
        'certified': 'advanced_certified'
      }

      // Use category slugs directly instead of UUIDs for simpler display
      const categoryIds = agent.categories

      // Convert translation keys to actual text
      const descriptionMap: Record<string, string> = {
        'agent_swiss_customer_support_short': 'Multilingual customer service agent for Swiss businesses',
        'agent_swiss_customer_support_desc': 'Advanced AI-powered customer support system specifically designed for Swiss businesses. Handles inquiries in all four national languages with cultural awareness and local business practice knowledge.',
        'agent_legal_advisor_ch_short': 'Legal assistant with Swiss legal expertise',
        'agent_legal_advisor_ch_desc': 'Specialized AI legal advisor trained on Swiss federal and cantonal law. Provides guidance on contracts, compliance, and regulatory matters specific to Switzerland.',
        'agent_swiss_translator_short': 'Precise translations between all Swiss national languages',
        'agent_swiss_translator_desc': 'Professional translation agent specializing in Swiss German, French, Italian, and Romansh. Understands regional dialects and cultural nuances for accurate localization.',
        'agent_swiss_data_analyst_short': 'Data analysis with Swiss privacy compliance',
        'agent_swiss_data_analyst_desc': 'AI-powered data analysis tool designed with Swiss data protection laws in mind. Processes and analyzes business data while ensuring FADP/GDPR compliance and maintaining data sovereignty.',
        'agent_swiss_tech_support_short': 'IT support in all Swiss languages',
        'agent_swiss_tech_support_desc': 'Multilingual technical support agent that helps resolve IT issues for Swiss businesses. Provides assistance in German, French, Italian, and English with local technical terminology.',
        'agent_swiss_marketing_assistant_short': 'Marketing campaigns for Swiss markets',
        'agent_swiss_marketing_assistant_desc': 'AI marketing assistant specialized in creating culturally appropriate campaigns for Swiss language regions. Analyzes market trends and consumer behavior across cantons.',
        'agent_swiss_household_manager_short': 'Family organization for Swiss households',
        'agent_swiss_household_manager_desc': 'Smart household management assistant that understands Swiss lifestyle, from recycling schedules to local shopping options. Helps organize daily life with Swiss-specific features.'
      }

      const agentData = {
        slug: agent.id,
        name: agent.name,
        short_description: descriptionMap[agent.shortDescription] || agent.shortDescription,
        description: descriptionMap[agent.description] || agent.description,
        logo_url: agent.logo,
        cover_image_url: agent.coverImage,
        category_ids: categoryIds,
        languages: agent.languages,
        features: agent.capabilities.map(cap => {
          const capabilitiesMap: Record<string, string> = {
            // Customer Support capabilities
            'multilingual_support_all_languages': 'Multilingual support for all Swiss languages',
            'automatic_ticket_creation': 'Automatic ticket creation and routing',
            'faq_responses': 'Intelligent FAQ responses',
            'escalation_to_humans': 'Smart escalation to human agents',
            'personalized_responses': 'Personalized customer responses',
            // Legal Advisor capabilities
            'answer_legal_questions': 'Answer legal questions with Swiss law expertise',
            'analyze_legal_documents': 'Analyze legal documents for compliance',
            'create_document_templates': 'Create legal document templates',
            'monitor_compliance': 'Monitor regulatory compliance',
            'notify_law_changes': 'Notify about relevant law changes',
            'swiss_law_knowledge': 'Comprehensive Swiss law knowledge',
            'contract_review': 'Contract review and analysis',
            'compliance_guidance': 'Compliance guidance for Swiss regulations',
            'multi_language_support': 'Multi-language legal document support',
            'case_law_citations': 'Case law citations and references',
            // Translator capabilities
            'translate_all_swiss_languages': 'Translate between all Swiss national languages',
            'consider_swiss_dialects': 'Consider regional Swiss dialects',
            'industry_translations': 'Industry-specific translations',
            'realtime_document_translation': 'Real-time document translation',
            'consistent_terminology': 'Ensure consistent terminology',
            'dialect_recognition': 'Swiss dialect recognition',
            'cultural_adaptation': 'Cultural context adaptation',
            'terminology_consistency': 'Terminology consistency checking',
            'format_preservation': 'Document format preservation',
            'real_time_translation': 'Real-time translation capabilities',
            // Data Analyst capabilities
            'analyze_business_data': 'Analyze business data with Swiss privacy compliance',
            'create_visualizations': 'Create data visualizations and reports',
            'predictive_analytics': 'Predictive analytics and forecasting',
            'data_privacy_compliance': 'Ensure FADP/GDPR data privacy compliance',
            'automated_reporting': 'Automated reporting and insights',
            // Tech Support capabilities
            'troubleshoot_it_problems': 'Troubleshoot IT problems in multiple languages',
            'system_diagnosis_monitoring': 'System diagnosis and monitoring',
            'step_by_step_guides': 'Provide step-by-step technical guides',
            'automated_problem_solving': 'Automated problem resolution',
            'escalate_to_human_techs': 'Escalate complex issues to human technicians',
            // Marketing Assistant capabilities
            'create_multilingual_content': 'Create multilingual marketing content',
            'analyze_campaign_performance': 'Analyze campaign performance metrics',
            'market_research_analysis': 'Conduct market research analysis',
            'optimize_marketing_strategies': 'Optimize marketing strategies',
            'personalize_customer_approach': 'Personalize customer engagement',
            // Household Manager capabilities
            'manage_household_tasks': 'Manage household tasks and schedules',
            'create_manage_shopping_lists': 'Create and manage shopping lists',
            'budget_planning_monitoring': 'Budget planning and expense monitoring',
            'reminders_deadlines': 'Set reminders for deadlines and appointments',
            'coordinate_family_activities': 'Coordinate family activities and events'
          }
          return capabilitiesMap[cap] || cap
        }),
        integrations: agent.integrations,
        technical_requirements: agent.technicalRequirements,
        verification_level: verificationLevelMap[agent.verificationLevel] || 'basic',
        average_rating: agent.rating,
        demo_available: agent.demoAvailable || false,
        concierge_compatible: agent.conciergeCompatible || false,
        deployment_type: agent.selfHosted ? 'self_hosted' : 'cloud',
        api_documentation_url: agent.apiEndpoint,
        status: 'approved', // All migrated agents are pre-approved
        provider_name: agent.provider.name,
        provider_location: agent.provider.location,
        provider_founded: agent.provider.founded,
        view_count: Math.floor(Math.random() * 1000) + 100, // Random view count
        inquiry_count: Math.floor(Math.random() * 50) + 5, // Random inquiry count
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last year
      }

      // Insert agent
      const { data: insertedAgent, error: agentError } = await supabase
        .from('agents')
        .upsert(agentData, { onConflict: 'slug' })
        .select('id')
        .single()

      if (agentError) {
        console.error(`❌ Failed to migrate agent ${agent.name}:`, agentError)
        continue
      }

      console.log(`✅ Migrated agent: ${agent.name}`)

      // Migrate reviews if any
      if (agent.reviews && agent.reviews.length > 0) {
        console.log(`📝 Migrating ${agent.reviews.length} reviews for ${agent.name}`)
        
        // Clear existing reviews for this agent first to avoid duplicates
        await supabase
          .from('agent_reviews')
          .delete()
          .eq('agent_id', insertedAgent.id)
          .eq('is_verified', true) // Only delete migrated reviews, not user reviews

        for (const review of agent.reviews) {
          // Map review comment translation keys to actual text
          const reviewCommentMap: Record<string, string> = {
            'agent_swiss_customer_support_review_1': 'Outstanding multilingual support that truly understands Swiss business needs. ROI increased by 35%.',
            'agent_swiss_customer_support_review_2': 'The agent handles Swiss German dialects perfectly. Our customers love the natural conversations.',
            'agent_legal_advisor_ch_review_1': 'Excellent for contract reviews. Saved us thousands in legal fees while ensuring compliance.',
            'agent_legal_advisor_ch_review_2': 'Very helpful for navigating cantonal differences in regulations. Highly recommended.',
            'agent_swiss_translator_review_1': 'The dialect handling is exceptional. Finally a translation service that gets Swiss German right.',
            'agent_swiss_translator_review_2': 'Fast, accurate, and culturally aware. Perfect for our multilingual documentation needs.',
            'agent_swiss_data_analyst_review_1': 'The FADP compliance features give us peace of mind. Excellent insights without compromising privacy.',
            'agent_swiss_data_analyst_review_2': 'Powerful analytics that respect Swiss data sovereignty. Essential for our pharmaceutical research.',
            'agent_swiss_tech_support_review_1': 'Reduced our IT ticket resolution time by 60%. The AI understands technical issues in all languages.',
            'agent_swiss_tech_support_review_2': 'Great integration with our existing systems. The multilingual support is a game-changer.',
            'agent_swiss_marketing_assistant_review_1': 'Helps us create culturally appropriate campaigns for each language region. Excellent tool.',
            'agent_swiss_marketing_assistant_review_2': 'The market insights for Swiss consumers are invaluable. Boosted our conversion rates significantly.',
            'agent_swiss_household_manager_review_1': 'Finally an app that understands Swiss recycling rules and local shopping options. Life-changing!',
            'agent_swiss_household_manager_review_2': 'Perfect for managing our busy family life. The reminders for Swiss holidays and school schedules are great.'
          }

          const reviewData = {
            agent_id: insertedAgent.id,
            rating: review.rating,
            review: reviewCommentMap[review.comment] || review.comment, // Use mapped text or fallback
            reviewer_name: review.author,
            is_verified: true, // Mark migrated reviews as verified
            created_at: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 6 months
          }

          const { error: reviewError } = await supabase
            .from('agent_reviews')
            .insert(reviewData)

          if (reviewError) {
            console.error(`❌ Failed to migrate review for ${agent.name}:`, reviewError)
          } else {
            console.log(`✅ Migrated review by ${review.author}`)
          }
        }
      }
    }

    console.log('🎉 Migration completed successfully!')
    console.log(`📊 Migrated ${featuredAgents.length} agents`)
    console.log(`📁 Created ${categoryMap.size} categories`)

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateAgents()
    .then(() => {
      console.log('✨ Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateAgents }