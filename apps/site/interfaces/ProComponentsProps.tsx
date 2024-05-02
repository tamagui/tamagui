import type { getProductsForServerSideRendering } from '@lib/product-pages-server'

export type ProComponentsProps = Awaited<
  ReturnType<typeof getProductsForServerSideRendering>
>
