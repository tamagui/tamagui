import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { sendCancellationEmail } from '~/features/email/helpers'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subId = body['subscription_id']
  if (typeof subId === 'undefined') {
    return Response.json(
      {
        error: 'subscription_id is required',
      },
      {
        status: 400,
      }
    )
  }

  if (typeof subId !== 'string') {
    return Response.json(
      {
        error: 'Invalid subscription_id',
      },
      {
        status: 400,
      }
    )
  }

  // use supabaseAdmin to bypass RLS - server-side client doesn't have proper session for RLS
  const { data: subData } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('id', subId)
    .single()

  if (!subData || subData.user_id !== user.id) {
    return Response.json(
      { message: 'no subscription found with the provided id that belongs to you' },
      {
        status: 404,
      }
    )
  }

  try {
    const current = await stripe.subscriptions.retrieve(subId)

    // a past_due/unpaid subscription has an open renewal invoice that Stripe keeps
    // retrying. cancel_at_period_end does NOT stop that retry, so the customer would
    // still get charged. for these we cancel immediately and void the open invoice to
    // actually stop collection. healthy subs keep the retain-access-until-period-end UX.
    const isPastDue = current.status === 'past_due' || current.status === 'unpaid'

    let data: Stripe.Subscription
    if (isPastDue) {
      if (current.latest_invoice) {
        const invoiceId =
          typeof current.latest_invoice === 'string'
            ? current.latest_invoice
            : current.latest_invoice.id
        const invoice = await stripe.invoices.retrieve(invoiceId)
        if (invoice.status === 'open' || invoice.status === 'draft') {
          await stripe.invoices.voidInvoice(invoiceId)
        }
      }
      data = await stripe.subscriptions.cancel(subId)
    } else {
      data = await stripe.subscriptions.update(subId, {
        cancel_at_period_end: true,
      })
    }

    if (data) {
      // send cancellation confirmation email
      const customer =
        typeof data.customer === 'string'
          ? await stripe.customers.retrieve(data.customer)
          : data.customer
      if (customer && !customer.deleted && customer.email) {
        // immediate cancellations end access now; scheduled ones end at period end
        const periodEnd = isPastDue
          ? new Date().toISOString()
          : new Date(data.current_period_end * 1000).toISOString()
        sendCancellationEmail(customer.email, {
          name: 'friend',
          periodEnd,
        })
      }
      return Response.json({
        message: isPastDue
          ? 'The subscription is cancelled and the pending charge has been stopped.'
          : 'The subscription is cancelled.',
      })
    }
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        { message: error.message },
        {
          status: error.statusCode || 500,
        }
      )
    }
    throw error
  }
})
