/**
 * Google OAuth authentication module
 */

/**
 * Initiates Google OAuth flow for calendar access
 */
export async function signInWithGoogle(): Promise<void> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    throw new Error('Google OAuth configuration is missing')
  }

  const scope = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email'
  ].join(' ')

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}&prompt=consent`

  window.location.href = authUrl
}

/**
 * Extracts the access token from the URL after OAuth redirect
 */
export function getGoogleAccessTokenFromUrl(): string | null {
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  return hashParams.get('access_token')
}

/**
 * Gets user info using the access token
 */
export async function getGoogleUserInfo(accessToken: string): Promise<{ email: string }> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  return response.json()
} 