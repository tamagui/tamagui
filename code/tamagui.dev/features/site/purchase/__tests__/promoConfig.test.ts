import { describe, expect, it } from 'vitest'
import { getActivePromoCoupon, getCheckoutCouponId, getPromoByCode } from '../promoConfig'

describe('checkout promotion configuration', () => {
  it('provides the active promotion synchronously for checkout rendering', () => {
    expect(getActivePromoCoupon()).toEqual({
      id: '5gXstiW7',
      code: 'BETA20',
      percent_off: 20,
      amount_off: null,
    })
  })

  it('defaults the server charge to the same active promotion', () => {
    expect(getCheckoutCouponId()).toBe('5gXstiW7')
    expect(getCheckoutCouponId(null)).toBe('5gXstiW7')
    expect(getCheckoutCouponId('')).toBe('5gXstiW7')
  })

  it('allows a validated customer coupon to override the active promotion', () => {
    expect(getCheckoutCouponId('customer-coupon')).toBe('customer-coupon')
  })

  it('matches configured promotion codes without case sensitivity', () => {
    expect(getPromoByCode('beta20')?.couponId).toBe('5gXstiW7')
  })
})
