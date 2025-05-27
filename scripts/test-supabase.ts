// Run this script with: npx tsx scripts/test-supabase.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure you have set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (catError) {
      console.error('Error fetching categories:', catError)
    } else {
      console.log(`✅ Found ${categories?.length || 0} categories`)
    }
    
    // Test 2: Check if we can query agents table
    const { error: agentError } = await supabase
      .from('agents')
      .select('count')
      .single()
    
    if (agentError && agentError.code !== 'PGRST116') {
      console.error('Error accessing agents table:', agentError)
    } else {
      console.log('✅ Agents table accessible')
    }
    
    // Test 3: Check auth
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user ? '✅ User authenticated' : '✅ No user authenticated (expected)')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testConnection()