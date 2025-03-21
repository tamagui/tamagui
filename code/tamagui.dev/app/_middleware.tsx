import { createMiddleware } from 'one'
import fs from 'node:fs'
import path from 'node:path'

// Cache for component versions to avoid filesystem operations on every request
const componentVersionCache = new Map<string, string[]>()

function initializeVersionCache() {
  const componentsDir = path.join(process.cwd(), 'data/docs/components')

  try {
    // Read all component directories
    const components = fs.readdirSync(componentsDir)

    for (const component of components) {
      const componentDir = path.join(componentsDir, component)
      if (fs.statSync(componentDir).isDirectory()) {
        // Get all versions for this component
        const versions = fs
          .readdirSync(componentDir)
          .filter((file) => file.endsWith('.mdx'))
          .map((file) => file.replace('.mdx', ''))
          .sort()
          .reverse()

        componentVersionCache.set(component, versions)
      }
    }
    console.info('Component version cache initialized')
  } catch (error) {
    console.error('Error initializing component version cache:', error)
  }
}

// Initialize the cache when the server starts
initializeVersionCache()

export default createMiddleware(async ({ request, next }) => {
  const url = new URL(request.url)

  // Handle markdown files for /ui/ path only
  if (url.pathname.endsWith('.md') && url.pathname.includes('/ui/')) {
    try {
      // Transform /ui/button.md -> button
      const componentPath = url.pathname
        .replace('.md', '')
        .split('/')
        .filter(Boolean)
        .slice(1)
        .join('/')

      // Get the component directory
      const componentDir = path.join(process.cwd(), 'data/docs/components', componentPath)

      // Get the latest version from cache instead of reading filesystem
      const versions = componentVersionCache.get(componentPath) || []

      if (versions.length === 0) {
        return new Response('Not Found', { status: 404 })
      }

      // Apply the latest version of the component
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

  // Handle markdown files for /docs/ path only
  if (url.pathname.endsWith('.md') && url.pathname.includes('/docs/')) {
    try {
      // Transform /docs/core/animations.md -> core/animations
      const docPath = url.pathname.replace('/docs/', '').replace('.md', '')

      // Get the docs file path (.mdx extension)
      const filePath = path.join(process.cwd(), 'data/docs', `${docPath}.mdx`)

      // Check if file exists
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
