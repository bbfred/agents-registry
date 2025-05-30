import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const search = searchParams.get('search')
    const categories = searchParams.get('categories')?.split(',').filter(Boolean)
    const languages = searchParams.get('languages')?.split(',').filter(Boolean)
    const verification = searchParams.get('verification')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query - simplified to avoid JOIN issues
    let query = supabase
      .from('agents')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`)
    }

    if (categories && categories.length > 0) {
      // For category filtering, we need to check if any of the category_ids array contains our categories
      const categoryFilter = categories.map(cat => `category_ids.cs.{"${cat}"}`).join(',')
      query = query.or(categoryFilter)
    }

    if (languages && languages.length > 0) {
      // For language filtering, check if any of the languages array contains our languages
      const languageFilter = languages.map(lang => `languages.cs.{"${lang}"}`).join(',')
      query = query.or(languageFilter)
    }

    if (verification) {
      query = query.eq('verification_level', verification)
    }

    const { data: agents, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend Agent interface
    const transformedAgents = agents?.map(agent => ({
      id: agent.slug,
      name: agent.name,
      logo: agent.logo_url || '/placeholder.svg?height=100&width=100',
      coverImage: agent.cover_image_url || '/placeholder.svg?height=200&width=400',
      shortDescription: agent.short_description || '',
      description: agent.description || '',
      categories: agent.category_ids || [], // Use the array directly for now
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
      reviews: [], // We'll handle reviews separately
      provider: {
        name: agent.provider_name || 'Unknown Provider',
        location: agent.provider_location || '',
        founded: agent.provider_founded || ''
      },
      createdAt: agent.created_at,
      updatedAt: agent.updated_at
    })) || []

    const response = NextResponse.json({
      agents: transformedAgents,
      total: count,
      limit,
      offset
    })

    // Add cache headers - cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    
    return response

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const body = await request.json()
    
    // TODO: Add authentication check
    // const token = request.headers.get('authorization')
    // Validate user is authenticated and has provider permissions

    const {
      name,
      slug,
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

    // Insert new agent
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name,
        slug,
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
        status: 'pending_review', // Requires approval
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create agent' },
        { status: 500 }
      )
    }

    return NextResponse.json(agent, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}