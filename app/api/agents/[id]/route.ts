import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { id } = params

    // Fetch agent with related data - simplified to avoid JOIN issues
    const { data: agent, error } = await supabase
      .from('agents')
      .select(`
        *,
        reviews:agent_reviews (
          id,
          rating,
          review,
          created_at,
          reviewer_name
        )
      `)
      .eq('slug', id)
      .eq('status', 'approved')
      .single()

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabase
      .from('agents')
      .update({ view_count: (agent.view_count || 0) + 1 })
      .eq('id', agent.id)

    // Transform the data to match the frontend Agent interface
    const transformedAgent = {
      id: agent.slug,
      name: agent.name,
      logo: agent.logo_url || '/placeholder.svg?height=100&width=100',
      coverImage: agent.cover_image_url || '/placeholder.svg?height=200&width=400',
      shortDescription: agent.short_description || '',
      description: agent.description || '',
      categories: agent.category_ids || [], // Use the array directly
      capabilities: agent.features || [],
      languages: agent.languages || [],
      integrations: agent.integrations || [],
      technicalRequirements: agent.technical_requirements || '',
      verificationLevel: agent.verification_level || 'basic',
      rating: parseFloat(agent.average_rating || '0'),
      selfHosted: agent.deployment_type === 'self_hosted' || agent.deployment_type === 'both',
      apiEndpoint: agent.api_documentation_url,
      demoAvailable: agent.demo_available || false,
      conciergeCompatible: agent.concierge_compatible || false,
      reviews: agent.reviews?.map((review: any) => ({
        author: review.reviewer_name || 'Anonymous User',
        rating: review.rating,
        comment: review.review, // Map 'review' column to 'comment' for frontend
        date: review.created_at
      })) || [],
      provider: {
        name: agent.provider_name || 'Unknown Provider',
        location: agent.provider_location || '',
        founded: agent.provider_founded || ''
      },
      // Additional details for the detail page
      websiteUrl: agent.website_url,
      documentationUrl: agent.documentation_url,
      apiDocumentationUrl: agent.api_documentation_url,
      supportEmail: agent.support_email,
      supportUrl: agent.support_url,
      pricingModel: agent.pricing_model,
      startingPrice: agent.starting_price,
      useCases: agent.use_cases || [],
      viewCount: agent.view_count || 0,
      inquiryCount: agent.inquiry_count || 0,
      verificationDate: agent.verification_date,
      createdAt: agent.created_at,
      updatedAt: agent.updated_at
    }

    return NextResponse.json(transformedAgent)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { id } = params
    const body = await request.json()
    
    // TODO: Add authentication check
    // Verify user owns this agent or is admin

    const {
      name,
      shortDescription,
      description,
      categories,
      languages,
      features,
      integrations,
      technicalRequirements,
      demoAvailable,
      conciergeCompatible,
      logoUrl,
      coverImageUrl,
      websiteUrl,
      apiDocumentationUrl,
      supportEmail,
      pricingModel,
      startingPrice
    } = body

    // Update agent
    const { data: agent, error } = await supabase
      .from('agents')
      .update({
        name,
        short_description: shortDescription,
        description,
        category_ids: categories,
        languages,
        features,
        integrations,
        technical_requirements: technicalRequirements,
        demo_available: demoAvailable,
        concierge_compatible: conciergeCompatible,
        logo_url: logoUrl,
        cover_image_url: coverImageUrl,
        website_url: websiteUrl,
        api_documentation_url: apiDocumentationUrl,
        support_email: supportEmail,
        pricing_model: pricingModel,
        starting_price: startingPrice,
        updated_at: new Date().toISOString()
      })
      .eq('slug', id)
      .select()
      .single()

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json(agent)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { id } = params
    
    // TODO: Add authentication check
    // Verify user owns this agent or is admin

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('slug', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete agent' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}