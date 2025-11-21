export const paths: {
  params: {
    section: 'ecommerce'
    part: string
  }
}[] = [
  {
    params: {
      section: 'ecommerce',
      part: 'payment',
    },
  },
  {
    params: {
      section: 'ecommerce',
      part: 'productpage',
    },
  },
  {
    params: {
      section: 'ecommerce',
      part: 'product_list',
    },
  },
]

export const listingData = [
  {
    sectionName: 'ecommerce',
    parts: [
      {
        name: 'Payment',
        numberOfComponents: 1,
        route: '/ecommerce/payment',
      },
      {
        name: 'Product Page',
        numberOfComponents: 1,
        route: '/ecommerce/productpage',
      },
    ],
  },
] as const
