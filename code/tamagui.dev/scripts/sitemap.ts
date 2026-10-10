// one build emits a <loc> per rendered route, but index routes come out with
// a trailing slash (/blog/) while the site serves the extensionless form
// (/blog/ redirects). normalize so the sitemap lists canonical urls only.

export function normalizeSitemapXml(xml: string): string {
  const seen = new Set<string>()
  return xml.replace(
    /(<url>\s*<loc>)([^<]+)(<\/loc>[\s\S]*?<\/url>)/g,
    (match, open: string, loc: string, rest: string) => {
      let normalized = loc
      try {
        const url = new URL(loc)
        if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1)
          normalized = url.toString()
        }
      } catch {
        // leave malformed locs untouched
      }
      if (seen.has(normalized)) return ''
      seen.add(normalized)
      return `${open}${normalized}${rest}`
    }
  )
}
