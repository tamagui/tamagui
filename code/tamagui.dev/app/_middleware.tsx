import { createMiddleware } from 'one'
import fs from 'node:fs'
import path from 'node:path'

// cache for component versions to avoid filesystem operations on every request
const componentVersionCache = new Map<string, string[]>()

function initializeVersionCache() {
  const componentsDir = path.join(process.cwd(), 'data/docs/components')

  try {
    const components = fs.readdirSync(componentsDir)

    for (const component of components) {
      const componentDir = path.join(componentsDir, component)
      if (fs.statSync(componentDir).isDirectory()) {
        const versions = fs
          .readdirSync(componentDir)
          .filter((file) => file.endsWith('.mdx'))
          .map((file) => file.replace('.mdx', ''))
          .sort()
          .reverse()

        componentVersionCache.set(component, versions)
      }
    }
  } catch (error) {
    console.error('Error initializing component version cache:', error)
  }
}

// initialize the cache when the server starts
initializeVersionCache()

export default createMiddleware(async ({ request, next }) => {
  const url = new URL(request.url)

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
