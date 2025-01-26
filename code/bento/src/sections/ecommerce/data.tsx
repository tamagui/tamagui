export const paths: {
  params: {
    section: 'ecommerce'
    part: string
  }
}[] = [
  {
    params: {
      section: 'ecommerce',
      part: 'cart',
    },
  },
  {
    params: {
      section: 'ecommerce',
      part: 'product_page',
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
        name: 'Cart',
        numberOfComponents: 1,
        route: '/ecommerce/cart',
      },
      {
        name: 'Product Page',
        numberOfComponents: 1,
        route: '/ecommerce/product_page',
      },
      // {
      //   name: 'Product List',
      //   numberOfComponents: 5,
      //   route: '/ecommerce/product_list',
      // },
    ],
  },
]
