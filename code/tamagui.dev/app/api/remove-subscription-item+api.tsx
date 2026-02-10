import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)
  const subItemId = body['subscription_item_id']

  if (typeof subItemId === 'undefined') {
    return Response.json(
      {
        error: 'subscription_item_id is required',
      },
      {
        status: 400,
      }
    )
  }

  if (typeof subItemId !== 'string') {
    return Response.json(
      {
        error: 'Invalid subscription_item_id',
      },
      {
        status: 400,
      }
    )
  }

  // use supabaseAdmin to bypass RLS - server-side client doesn't have proper session for RLS
  const { data: subItemData } = await supabaseAdmin
    .from('subscription_items')
    .select('id, subscription_id')
    .eq('id', subItemId)
    .single()

  if (!subItemData) {
    return Response.json(
      {
        message: 'no subscription item found with the provided id that belongs to you',
      },
      {
        status: 404,
      }
    )
  }

  // verify the subscription belongs to this user
  const { data: subData } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('id', subItemData.subscription_id)
    .single()

  if (!subData || subData.user_id !== user.id) {
    return Response.json(
      {
        message: 'no subscription item found with the provided id that belongs to you',
      },
      {
        status: 404,
      }
    )
  }

  try {
    const { deleted } = await stripe.subscriptionItems.del(subItemId)
    if (deleted) {
      return Response.json({ message: 'deleted successfully' })
    }

    return Response.json({ message: 'couldnt delete!' }, { status: 500 })
  } catch (error) {
    return Response.json(
      { message: 'deletion failed', error: `${error}` },
      { status: 500 }
    )
  }
})
