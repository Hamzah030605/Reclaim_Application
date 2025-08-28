import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { photoData, mode, description } = body

    if (!photoData) {
      return NextResponse.json(
        { error: 'Photo data is required' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const base64Data = photoData.replace(/^data:image\/[a-z]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${mode}-${timestamp}.jpg`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload photo' },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filename)

    // Save photo metadata to database
    const { data: photoRecord, error: dbError } = await supabase
      .from('user_photos')
      .insert({
        user_id: user.id,
        photo_url: publicUrl,
        mode: mode || 'selfie',
        description: description || '',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save photo metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        id: photoRecord.id,
        photo_url: publicUrl,
        mode: photoRecord.mode,
        created_at: photoRecord.created_at
      }
    })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's photos
    const { data: photos, error: fetchError } = await supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch photos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: photos
    })

  } catch (error) {
    console.error('Photo fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
