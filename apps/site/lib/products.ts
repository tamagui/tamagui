const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublicKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY env var is not set')
}

const isStripeProd = stripePublicKey.startsWith('pk')

const products = {
  'universal-starter': {},
}
type ProductSlug = keyof typeof products

const productStripeIdMap: Record<ProductSlug, string> = isStripeProd
  ? {
      'universal-starter': 'prod_Nwms6lH2V2N7Sm',
    }
  : {
      'universal-starter': '', // TODO: update with production product id for launch
    }

export function getStripeProductId(product: ProductSlug) {
  return productStripeIdMap[product]
}
export function getProductSlug(id: string) {
  return Object.keys(productStripeIdMap)[
    Object.values(productStripeIdMap).findIndex((_id) => _id === id)
  ] as ProductSlug
}
