import { describe, expect, it, vi } from 'vitest'
import {
  isPendingRenewalInvoice,
  shouldCancelImmediately,
  stopInvoiceCollection,
} from '../cancelSubscription'

describe('subscription cancellation', () => {
  it('cancels immediately while an active renewal invoice is pending collection', () => {
    expect(
      shouldCancelImmediately('active', {
        billing_reason: 'subscription_cycle',
        status: 'draft',
      })
    ).toBe(true)
    expect(
      shouldCancelImmediately('active', {
        billing_reason: 'subscription_cycle',
        status: 'open',
      })
    ).toBe(true)
  })

  it('keeps period-end cancellation for an active subscription with no pending renewal', () => {
    expect(
      shouldCancelImmediately('active', {
        billing_reason: 'subscription_cycle',
        status: 'paid',
      })
    ).toBe(false)
    expect(
      shouldCancelImmediately('active', {
        billing_reason: 'subscription_create',
        status: 'open',
      })
    ).toBe(false)
  })

  it('cancels failed-payment subscriptions immediately', () => {
    expect(shouldCancelImmediately('past_due', null)).toBe(true)
    expect(shouldCancelImmediately('unpaid', null)).toBe(true)
  })

  it('stops draft invoice advancement and voids open invoices', async () => {
    const disableDraftInvoiceAutoAdvance = vi.fn(async () => undefined)
    const voidOpenInvoice = vi.fn(async () => undefined)
    const actions = { disableDraftInvoiceAutoAdvance, voidOpenInvoice }

    await stopInvoiceCollection({ id: 'in_draft', status: 'draft' } as any, actions)
    await stopInvoiceCollection({ id: 'in_open', status: 'open' } as any, actions)

    expect(disableDraftInvoiceAutoAdvance).toHaveBeenCalledWith('in_draft')
    expect(voidOpenInvoice).toHaveBeenCalledWith('in_open')
  })
})

describe('isPendingRenewalInvoice', () => {
  it('only matches collectible cycle invoices', () => {
    expect(isPendingRenewalInvoice(null)).toBe(false)
    expect(
      isPendingRenewalInvoice({ billing_reason: 'subscription_cycle', status: 'void' })
    ).toBe(false)
    expect(isPendingRenewalInvoice({ billing_reason: 'manual', status: 'open' })).toBe(
      false
    )
  })
})
