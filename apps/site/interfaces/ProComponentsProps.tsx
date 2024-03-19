import type Stripe from 'stripe'
import type { Database } from '@lib/supabase-types'

export type ProComponentsProps = {
  proComponents?: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  defaultCoupon?: Stripe.Coupon | null
  takeoutPlusBentoCoupon?: Stripe.Coupon | null
}
