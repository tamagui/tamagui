import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  const { supabase } = await ensureAuth({ req })
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

  const { error } = await supabase
    .from('subscription_items')
    .select('id')
    .eq('id', subItemId)
    .single()

  if (error) {
    console.error(error)
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
