import { mailingListSignup } from '~/features/email/mailingListSignup'

export const POST = async (req: Request): Promise<Response> => {
  try {
    if (!req.headers.get('Content-Type')?.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid content type' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const formData = await req.formData()
    const email = formData.get('email')
    const turnstileToken = formData.get('cf-turnstile-response')

    if (typeof email !== 'string' || typeof turnstileToken !== 'string') {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid form data' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate the Turnstile token
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.CLOUDFLARE_TURNSTYLE_SECRET!,
          response: turnstileToken,
          remoteip: req.headers.get('CF-Connecting-IP') || '', // Optional: includes the user's IP if available
        }),
      }
    )

    const turnstileData = await turnstileResponse.json()

    if (!turnstileData.success) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Turnstile validation failed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Call the mailingListSignup function with the validated email
    const signupResult = await mailingListSignup(email)

    if (signupResult.success) {
      return new Response(JSON.stringify({ status: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ status: 'error', message: signupResult.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
