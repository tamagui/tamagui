import type Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { isAdminEmail } from '~/features/api/isAdmin'
import { stripe } from '~/features/stripe/stripe'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

/**
 * Get recent purchases for admin review
 * Admin-only endpoint
 */
export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  // check admin access
  if (!isAdminEmail(user.email)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100)

  try {
    // get recent successful payments from Stripe
    const charges = await stripe.charges.list({
      limit,
      expand: ['data.customer'],
    })

    const purchases = await Promise.all(
      charges.data
        .filter((charge) => charge.status === 'succeeded' && charge.paid)
        .map(async (charge) => {
          const customer = charge.customer as
            | Stripe.Customer
            | Stripe.DeletedCustomer
            | null
          const customerEmail =
            customer && 'email' in customer && !customer.deleted ? customer.email : null

          // try to find user in supabase by email
          let supabaseUser: {
            id: string
            email: string | null
            full_name: string | null
          } | null = null
          if (customerEmail) {
            const { data } = await supabaseAdmin
              .from('users')
              .select('id, email, full_name')
              .eq('email', customerEmail)
              .single()
            supabaseUser = data
          }

          // get github username if we have user
          let githubUsername: string | null = null
          if (supabaseUser?.id) {
            const { data: privateData } = await supabaseAdmin
              .from('users_private')
              .select('github_user_name')
              .eq('id', supabaseUser.id)
              .single()
            githubUsername = privateData?.github_user_name ?? null
          }

          return {
            id: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            created: charge.created,
            description: charge.description,
            customerEmail,
            customerId: typeof customer === 'string' ? customer : customer?.id || null,
            supabaseUserId: supabaseUser?.id || null,
            userName: supabaseUser?.full_name || null,
            githubUsername,
          }
        })
    )

    return Response.json({ purchases })
  } catch (error) {
    console.error('Error fetching recent purchases:', error)
    return Response.json({ error: 'Failed to fetch purchases' }, { status: 500 })
  }
})
