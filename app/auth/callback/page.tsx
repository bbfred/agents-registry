'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('userType') || 'user'

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/sign-in')
        return
      }

      if (session?.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!profile) {
          // Create profile for OAuth users
          await supabase
            .from('user_profiles')
            .insert({
              id: session.user.id,
              user_type: userType,
              email: session.user.email,
              first_name: session.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: session.user.user_metadata?.full_name?.split(' ')[1] || '',
            })
        }

        // Redirect based on user type
        if (userType === 'provider' || profile?.user_type === 'provider') {
          router.push('/dashboard')
        } else {
          router.push('/agents')
        }
      }
    }

    handleCallback()
  }, [router, userType])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}