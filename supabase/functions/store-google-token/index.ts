import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        },
      })
    }

    // Validate request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Extract and validate token from request
    const { access_token, expires_in } = await req.json()
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 })
    }
    const userToken = authHeader.replace('Bearer ', '')

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { 
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    )

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(userToken)
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response('Unauthorized', { status: 401 })
    }

    // Update user metadata with Google token
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          google_access_token: access_token,
          google_token_expiry: Date.now() + expires_in * 1000,
        }
      }
    )

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response('Failed to store token', { status: 500 })
    }

    return new Response(
      JSON.stringify({ message: 'Token stored successfully' }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}) 