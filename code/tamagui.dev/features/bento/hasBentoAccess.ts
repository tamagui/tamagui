import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export const hasBentoAccess = async (userId: string) => {
  const result = await supabaseAdmin
    .from('product_ownership')
    .select(`
      *,
      prices (
        *,
        products (
          *
        )
      )
    `)
    .eq('user_id', userId)
    .eq('prices.products.name', 'Bento')

  return Boolean(result?.data?.length)
}

export const hasBentoAccessV2 = async (userId: string) => {
  const result = await supabaseAdmin
    .from('product_ownership')
    .select(`
      *,
      prices (
        *,
        products (
          *
        )
      )
    `)
    .eq('user_id', userId)
    .eq('prices.products.name', 'Bento')

  return Boolean(result?.data?.length)
}
