import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const body = await request.json()
    
    const {
      agentId,
      agentSlug,
      fullName,
      email,
      company,
      message,
      inquiryType = 'general',
      contactMethod = 'email'
    } = body

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, message' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get agent ID from slug if not provided
    let resolvedAgentId = agentId
    if (!resolvedAgentId && agentSlug) {
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('slug', agentSlug)
        .single()
      
      resolvedAgentId = agent?.id
    }

    // Insert inquiry
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        agent_id: resolvedAgentId,
        full_name: fullName,
        email,
        company,
        message,
        inquiry_type: inquiryType,
        preferred_contact_method: contactMethod,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      )
    }

    // Update agent inquiry count
    if (resolvedAgentId) {
      await supabase.rpc('increment_inquiry_count', {
        agent_id: resolvedAgentId
      })
    }

    // TODO: Send email notification to agent provider
    // TODO: Send confirmation email to inquirer

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: 'Inquiry submitted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    
    // TODO: Add authentication check
    // Only allow providers to see inquiries for their agents
    // Only allow admins to see all inquiries

    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('inquiries')
      .select(`
        *,
        agents (
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: inquiries, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      inquiries: inquiries || [],
      total: count,
      limit,
      offset
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}