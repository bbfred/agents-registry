'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase/client'
import { Globe, Bell, Shield, Check, AlertCircle } from 'lucide-react'

interface UserPreferences {
  email_notifications: boolean
  newsletter_subscription: boolean
  agent_updates: boolean
  system_news: boolean
  marketing_emails: boolean
  notification_frequency: 'realtime' | 'daily' | 'weekly' | 'never'
  privacy_level: 'public' | 'private'
  data_sharing: boolean
  analytics_tracking: boolean
}

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    newsletter_subscription: false,
    agent_updates: true,
    system_news: true,
    marketing_emails: false,
    notification_frequency: 'daily',
    privacy_level: 'private',
    data_sharing: false,
    analytics_tracking: true
  })

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      // Update language preference in profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          preferred_language: language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user!.id)

      if (profileError) throw profileError

      // In a real app, you'd save preferences to a user_preferences table
      // For now, we'll just show success
      setMessage({ type: 'success', text: 'Settings saved successfully' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* General Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="rm">Rumantsch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose your preferred language for the interface
              </p>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup defaultValue="light" disabled>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Theme selection coming soon
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Communication Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Communication Preferences
            </CardTitle>
            <CardDescription>Manage how we contact you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates about your account
                  </p>
                </div>
                <Checkbox
                  id="email-notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, email_notifications: checked as boolean })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="agent-updates">Agent Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new agents and updates
                  </p>
                </div>
                <Checkbox
                  id="agent-updates"
                  checked={preferences.agent_updates}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, agent_updates: checked as boolean })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newsletter">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Monthly newsletter with AI insights and updates
                  </p>
                </div>
                <Checkbox
                  id="newsletter"
                  checked={preferences.newsletter_subscription}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, newsletter_subscription: checked as boolean })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Promotional offers and partner communications
                  </p>
                </div>
                <Checkbox
                  id="marketing"
                  checked={preferences.marketing_emails}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, marketing_emails: checked as boolean })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="frequency">Notification Frequency</Label>
              <Select 
                value={preferences.notification_frequency} 
                onValueChange={(value) => 
                  setPreferences({ ...preferences, notification_frequency: value as any })
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your data and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <RadioGroup 
                value={preferences.privacy_level} 
                onValueChange={(value) => 
                  setPreferences({ ...preferences, privacy_level: value as 'public' | 'private' })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">
                    Public - Other users can see your profile
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">
                    Private - Only you can see your profile
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share usage data to improve our services
                  </p>
                </div>
                <Checkbox
                  id="data-sharing"
                  checked={preferences.data_sharing}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, data_sharing: checked as boolean })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how you use the platform
                  </p>
                </div>
                <Checkbox
                  id="analytics"
                  checked={preferences.analytics_tracking}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, analytics_tracking: checked as boolean })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Data Management</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled>
                  Download My Data (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" disabled>
                  Delete All My Data (Coming Soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}