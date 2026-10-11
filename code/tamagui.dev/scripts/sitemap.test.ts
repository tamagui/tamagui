import { describe, expect, it } from 'vitest'

import { normalizeSitemapXml } from './sitemap'

const wrap = (locs: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locs
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n')}\n</urlset>\n`

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

describe('normalizeSitemapXml', () => {
  it('strips trailing slashes so urls match the canonical extensionless form', () => {
    const out = normalizeSitemapXml(
      wrap(['https://tamagui.dev/blog/', 'https://tamagui.dev/ui/button'])
    )
    expect(locs(out)).toEqual([
      'https://tamagui.dev/blog',
      'https://tamagui.dev/ui/button',
    ])
  })

  it('keeps the root trailing slash', () => {
    const out = normalizeSitemapXml(wrap(['https://tamagui.dev/']))
    expect(locs(out)).toEqual(['https://tamagui.dev/'])
  })

  it('drops duplicate urls', () => {
    const out = normalizeSitemapXml(
      wrap(['https://tamagui.dev/blog/', 'https://tamagui.dev/blog'])
    )
    expect(locs(out)).toEqual(['https://tamagui.dev/blog'])
  })
})
