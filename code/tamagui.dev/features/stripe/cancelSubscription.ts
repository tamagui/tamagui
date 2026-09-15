import type Stripe from 'stripe'

const STOPPABLE_INVOICE_STATUSES: Array<Stripe.Invoice.Status> = ['draft', 'open']

export function isPendingRenewalInvoice(
  invoice: Pick<Stripe.Invoice, 'billing_reason' | 'status'> | null
): boolean {
  return (
    invoice?.billing_reason === 'subscription_cycle' &&
    !!invoice.status &&
    STOPPABLE_INVOICE_STATUSES.includes(invoice.status)
  )
}

export function shouldCancelImmediately(
  subscriptionStatus: Stripe.Subscription.Status,
  latestInvoice: Pick<Stripe.Invoice, 'billing_reason' | 'status'> | null
): boolean {
  return (
    subscriptionStatus === 'past_due' ||
    subscriptionStatus === 'unpaid' ||
    isPendingRenewalInvoice(latestInvoice)
  )
}

export async function stopInvoiceCollection(
  invoice: Stripe.Invoice,
  actions: {
    disableDraftInvoiceAutoAdvance: (invoiceId: string) => Promise<unknown>
    voidOpenInvoice: (invoiceId: string) => Promise<unknown>
  }
): Promise<void> {
  if (invoice.status === 'draft') {
    await actions.disableDraftInvoiceAutoAdvance(invoice.id)
  } else if (invoice.status === 'open') {
    await actions.voidOpenInvoice(invoice.id)
  }
}
