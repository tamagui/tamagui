import type { getProductsForServerSideRendering } from '../site/purchase/server-helpers'

export type ProComponentsProps = Awaited<
  ReturnType<typeof getProductsForServerSideRendering>
>
