import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testAPI() {
  console.log('🧪 Testing API functionality...')
  
  try {
    // Test 1: List agents
    console.log('\n📋 Testing agents listing...')
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('status', 'approved')
      .limit(3)

    if (agentsError) {
      console.error('❌ Agents query failed:', agentsError)
    } else {
      console.log(`✅ Found ${agents?.length || 0} agents`)
      agents?.forEach(agent => {
        console.log(`  - ${agent.name} (${agent.slug})`)
      })
    }

    // Test 2: Get specific agent
    console.log('\n🔍 Testing specific agent lookup...')
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select(`
        *,
        reviews:agent_reviews (
          rating,
          review,
          reviewer_name
        )
      `)
      .eq('slug', 'swiss-customer-support')
      .single()

    if (agentError) {
      console.error('❌ Agent lookup failed:', agentError)
    } else {
      console.log(`✅ Found agent: ${agent?.name}`)
      console.log(`  - Reviews: ${agent?.reviews?.length || 0}`)
      agent?.reviews?.forEach((review: any) => {
        console.log(`    ${review.rating}⭐ by ${review.reviewer_name}`)
      })
    }

    // Test 3: Check categories
    console.log('\n📂 Testing categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, name')
      .limit(5)

    if (categoriesError) {
      console.error('❌ Categories query failed:', categoriesError)
    } else {
      console.log(`✅ Found ${categories?.length || 0} categories`)
      categories?.forEach(cat => {
        console.log(`  - ${cat.slug}: ${JSON.stringify(cat.name)}`)
      })
    }

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testAPI()
  .then(() => console.log('\n🎉 API tests completed'))
  .catch(error => console.error('💥 Test script failed:', error))