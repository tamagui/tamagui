import { createMiddleware } from 'one'
import { getDocsLinkHref, getDocsSyntaxParam } from '~/features/docs/docsVersion'
import fs from 'node:fs'
import path from 'node:path'
import {
  buildLlmsTxt,
  getComponentVersions,
} from '~/features/docs/docsSourceFiles'

// read once at server start to avoid filesystem operations on every request
const componentVersionCache = getComponentVersions()

// cache for llms.txt (full docs)
const llmsTxtCache = {
  content: '',
  lastUpdated: 0,
}

function getLlmsTxt() {
  // return cached version if less than 24 hours old (~1MB cached)
  if (Date.now() - llmsTxtCache.lastUpdated < 86400000 && llmsTxtCache.content) {
    return llmsTxtCache.content
  }

  const combined = buildLlmsTxt()

  llmsTxtCache.content = combined
  llmsTxtCache.lastUpdated = Date.now()

  return combined
}

export default createMiddleware(async ({ request, next }) => {
  const url = new URL(request.url)

  if (getDocsSyntaxParam(url.searchParams.get('syntax'))) {
    const href = `${url.pathname}${url.search}`
    const canonicalHref = getDocsLinkHref(href, url.pathname)
    if (canonicalHref !== href) {
      return Response.redirect(new URL(canonicalHref, url.origin), 307)
    }
  }

  // handle llms.txt - serve full docs directly (no redirect)
  if (
    url.pathname === '/llms.txt' ||
    url.pathname === '/llms-full.txt' ||
    url.pathname === '/docs.txt'
  ) {
    try {
      const content = getLlmsTxt()
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      })
    } catch (error) {
      console.error('Error serving llms.txt:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }

  // handle markdown files for /ui/ path only
  if (url.pathname.endsWith('.md') && url.pathname.includes('/ui/')) {
    try {
      const componentPath = url.pathname
        .replace('.md', '')
        .split('/')
        .filter(Boolean)
        .slice(1)
        .join('/')

      const componentDir = path.join(process.cwd(), 'data/docs/components', componentPath)
      const versions = componentVersionCache.get(componentPath) || []

      if (versions.length === 0) {
        return new Response('Not Found', { status: 404 })
      }

      const filePath = path.join(componentDir, `${versions[0]}.mdx`)
      const source = fs.readFileSync(filePath, 'utf-8')

      return new Response(source, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch (error) {
      console.error('Error serving markdown:', error)
      return new Response('Not Found', { status: 404 })
    }
  }

  // handle markdown files for /docs/ path only
  if (url.pathname.endsWith('.md') && url.pathname.includes('/docs/')) {
    try {
      const docPath = url.pathname.replace('/docs/', '').replace('.md', '')
      const filePath = path.join(process.cwd(), 'data/docs', `${docPath}.mdx`)

      if (!fs.existsSync(filePath)) {
        return new Response('Not Found', { status: 404 })
      }

      const source = fs.readFileSync(filePath, 'utf-8')

      return new Response(source, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch (error) {
      console.error('Error serving markdown:', error)
      return new Response('Not Found', { status: 404 })
    }
  }

  return next()
})
