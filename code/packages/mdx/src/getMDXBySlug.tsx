import * as MDX from '@vxrn/mdx'
import rehypeHeroTemplate from './rehypeHeroTemplate'

export const getMDXBySlug = async (basePath: string, slug: string) => {
  return await MDX.getMDXBySlug(basePath, slug, [rehypeHeroTemplate])
}
