import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSignup() {
  const testEmail = `test${Date.now()}@example.com`
  const testPassword = 'testpass123'
  
  console.log('Testing signup with:', testEmail)
  
  try {
    // Step 1: Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
        }
      }
    })
    
    if (authError) {
      console.error('❌ Auth signup error:', authError)
      return
    }
    
    console.log('✅ Auth signup successful:', authData.user?.id)
    
    // Step 2: Try to create profile
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          user_type: 'user',
          first_name: 'Test',
          last_name: 'User',
          email: testEmail,
          preferred_language: 'en'
        })
        .select()
        
      if (profileError) {
        console.error('❌ Profile creation error:', profileError)
        console.error('Error details:', JSON.stringify(profileError, null, 2))
      } else {
        console.log('✅ Profile created successfully:', profileData)
      }
    }
    
    // Cleanup - delete the test user
    if (authData.user) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        authData.user.id
      )
      if (deleteError) {
        console.log('Note: Could not delete test user (requires service role key)')
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testSignup()