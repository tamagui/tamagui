// TODO: fix this server-helpers not found error
// import type { getProductsForServerSideRendering } from '../site/purchase/server-helpers'

// export type ProComponentsProps = Awaited<
//   ReturnType<typeof getProductsForServerSideRendering>
// >
export type ProComponentsProps = {
  products: {
    id: string
    name: string
    description?: string
    price: number
  }[]
}
