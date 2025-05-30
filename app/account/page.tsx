'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase/client'
import { User, Shield, Building, AlertCircle, Check } from 'lucide-react'

export default function AccountPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    preferred_language: 'en'
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in')
      return
    }
    
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_name: profile.company_name || '',
        preferred_language: profile.preferred_language || 'en'
      })
    }
  }, [user, profile, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          preferred_language: formData.preferred_language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id)

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      })
      
      if (error) throw error
      
      setMessage({ type: 'success', text: 'Password reset email sent' })
    } catch (error) {
      console.error('Error sending reset email:', error)
      setMessage({ type: 'error', text: 'Failed to send reset email' })
    } finally {
      setLoading(false)
    }
  }

  const userInitials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U'

  const getVerificationBadge = () => {
    switch (profile?.verification_level) {
      case 'email_verified':
        return <Badge variant="secondary">Email Verified</Badge>
      case 'identity_verified':
        return <Badge variant="default">Identity Verified</Badge>
      case 'business_verified':
        return <Badge className="bg-blue-500">Business Verified</Badge>
      default:
        return <Badge variant="outline">Unverified</Badge>
    }
  }

  const getAccountTypeBadge = () => {
    switch (profile?.user_type) {
      case 'provider':
        return <Badge variant="default"><Building className="mr-1 h-3 w-3" />Provider</Badge>
      case 'admin':
        return <Badge variant="destructive"><Shield className="mr-1 h-3 w-3" />Admin</Badge>
      default:
        return <Badge variant="secondary"><User className="mr-1 h-3 w-3" />User</Badge>
    }
  }

  if (authLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your account information and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || ''} />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'No name set'
                    }
                  </h2>
                  {getAccountTypeBadge()}
                  {getVerificationBadge()}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                {profile?.company_name && (
                  <p className="text-sm text-muted-foreground">{profile.company_name}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {profile?.user_type === 'provider' && (
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Acme Inc."
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need assistance.
                </p>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send a password reset email to change your password
              </p>
              <Button variant="outline" onClick={handlePasswordReset} disabled={loading}>
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Account Deletion</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data
              </p>
              <Button variant="destructive" disabled>
                Delete Account (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Provider-Specific Section */}
        {profile?.user_type === 'provider' && (
          <Card>
            <CardHeader>
              <CardTitle>Provider Dashboard</CardTitle>
              <CardDescription>Manage your agents and provider account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Your Agents</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage your registered AI agents
                  </p>
                </div>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  View Dashboard
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Verification Status</h3>
                <div className="flex items-center gap-2 mb-2">
                  {getVerificationBadge()}
                  <span className="text-sm text-muted-foreground">
                    {profile.verification_date 
                      ? `Verified on ${new Date(profile.verification_date).toLocaleDateString()}`
                      : 'Not yet verified'
                    }
                  </span>
                </div>
                {profile.verification_level !== 'business_verified' && (
                  <p className="text-sm text-muted-foreground">
                    Business verification provides additional trust signals for your agents.
                    <Button variant="link" className="p-0 h-auto ml-1">
                      Learn more
                    </Button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}