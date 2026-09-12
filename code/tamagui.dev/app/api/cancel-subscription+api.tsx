import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { sendCancellationEmail } from '~/features/email/helpers'
import {
  shouldCancelImmediately,
  stopInvoiceCollection,
} from '~/features/stripe/cancelSubscription'
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

  console.info('Subscription cancellation requested', {
    subscriptionId: subId,
    userId: user.id,
  })

  try {
    const current = await stripe.subscriptions.retrieve(subId)
    let latestInvoice: Stripe.Invoice | null = null
    if (current.latest_invoice) {
      const invoiceId =
        typeof current.latest_invoice === 'string'
          ? current.latest_invoice
          : current.latest_invoice.id
      latestInvoice = await stripe.invoices.retrieve(invoiceId)
    }

    // a past_due/unpaid subscription has an open renewal invoice that Stripe keeps
    // retrying. an active subscription can also have a draft/open renewal invoice after
    // Stripe advances its period but before the charge runs. cancel_at_period_end does
    // not stop either invoice, so stop collection and cancel immediately in those cases.
    // healthy subscriptions keep the retain-access-until-period-end experience.
    const cancelImmediately = shouldCancelImmediately(current.status, latestInvoice)

    let data: Stripe.Subscription
    if (cancelImmediately) {
      if (latestInvoice) {
        await stopInvoiceCollection(latestInvoice, {
          disableDraftInvoiceAutoAdvance: (invoiceId) =>
            stripe.invoices.update(invoiceId, { auto_advance: false }),
          voidOpenInvoice: (invoiceId) => stripe.invoices.voidInvoice(invoiceId),
        })
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
        const periodEnd = cancelImmediately
          ? new Date().toISOString()
          : new Date(data.current_period_end * 1000).toISOString()
        try {
          await sendCancellationEmail(customer.email, {
            name: 'friend',
            periodEnd,
          })
        } catch (error) {
          console.error('Failed to send subscription cancellation email', {
            subscriptionId: subId,
            error,
          })
        }
      }

      console.info('Subscription cancellation completed', {
        subscriptionId: subId,
        userId: user.id,
        cancelImmediately,
        status: data.status,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      })

      return Response.json({
        message: cancelImmediately
          ? 'The subscription is cancelled and the pending charge has been stopped.'
          : 'The subscription is cancelled.',
        status: data.status,
        cancel_at_period_end: data.cancel_at_period_end,
        current_period_end: new Date(data.current_period_end * 1000).toISOString(),
      })
    }
  } catch (error) {
    console.error('Subscription cancellation failed', {
      subscriptionId: subId,
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    })
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
