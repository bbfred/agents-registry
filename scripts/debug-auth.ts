import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugAuth() {
  console.log('🔍 Debugging Supabase Auth Setup...\n')
  
  // Test 1: Check if we can query user_profiles table
  console.log('1. Testing user_profiles table access:')
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1)
  
  if (profileError) {
    console.error('❌ Error accessing user_profiles:', profileError.message)
  } else {
    console.log('✅ user_profiles table accessible')
  }
  
  // Test 2: Check table columns
  console.log('\n2. Checking user_profiles columns:')
  const { data: columns, error: columnsError } = await supabase
    .rpc('get_table_columns', { table_name: 'user_profiles' })
    .single()
  
  if (columnsError) {
    // Try a direct query instead
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0)
    
    if (!error) {
      console.log('✅ Table exists and is queryable')
    } else {
      console.error('❌ Cannot query table:', error.message)
    }
  }
  
  // Test 3: Check RLS policies
  console.log('\n3. Testing RLS policies:')
  console.log('(RLS policies can only be fully tested with an authenticated user)')
  
  // Test 4: Try to create a test profile (will fail without auth)
  console.log('\n4. Testing profile creation (expected to fail without auth):')
  const testProfile = {
    id: '00000000-0000-0000-0000-000000000000',
    user_type: 'user',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com'
  }
  
  const { error: insertError } = await supabase
    .from('user_profiles')
    .insert(testProfile)
  
  if (insertError) {
    if (insertError.message.includes('RLS') || insertError.message.includes('policy')) {
      console.log('✅ RLS is working (insert blocked as expected)')
    } else {
      console.error('❌ Unexpected error:', insertError.message)
    }
  }
  
  console.log('\n📋 Summary:')
  console.log('- Make sure Email/Password auth is enabled in Supabase Dashboard')
  console.log('- Check that the user_profiles table has all required columns')
  console.log('- Verify RLS policies allow authenticated users to insert their own profile')
  console.log('- Check the email sync trigger is properly set up')
}

// Add RPC function if it doesn't exist
async function createHelperFunction() {
  const functionSQL = `
    CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
    RETURNS TABLE(column_name text, data_type text, is_nullable text)
    LANGUAGE sql
    SECURITY DEFINER
    AS $$
      SELECT 
        column_name::text, 
        data_type::text, 
        is_nullable::text
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND information_schema.columns.table_name = $1
      ORDER BY ordinal_position;
    $$;
  `
  
  console.log('\nNote: If you see column info errors, you may need to run this SQL in Supabase:')
  console.log(functionSQL)
}

debugAuth().then(() => {
  createHelperFunction()
})