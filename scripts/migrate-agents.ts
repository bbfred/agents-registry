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

      const agentData = {
        slug: agent.id,
        name: agent.name,
        short_description: agent.shortDescription,
        description: agent.description,
        logo_url: agent.logo,
        cover_image_url: agent.coverImage,
        category_ids: categoryIds,
        languages: agent.languages,
        features: agent.capabilities,
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

          const reviewData = {
            agent_id: insertedAgent.id,
            rating: review.rating,
            review: review.comment, // Use 'review' column name, not 'comment'
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