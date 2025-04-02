import { createMiddleware } from 'one'
import fs from 'node:fs'
import path from 'node:path'

// Cache for component versions to avoid filesystem operations on every request
const componentVersionCache = new Map<string, string[]>()

// Add new cache for combined docs
const combinedDocsCache = {
  content: '',
  lastUpdated: 0,
}

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

// Add function to combine all docs
async function getCombinedDocs() {
  // Return cached version if less than 1 hour old
  if (Date.now() - combinedDocsCache.lastUpdated < 3600000) {
    return combinedDocsCache.content
  }

  const docsDir = path.join(process.cwd(), 'data/docs')
  let combined = '# Tamagui Complete Documentation\n\n'

  try {
    // Recursively get all .mdx files
    function getAllFiles(dir: string): string[] {
      const files: string[] = []
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        if (fs.statSync(fullPath).isDirectory()) {
          files.push(...getAllFiles(fullPath))
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath)
        }
      }
      return files
    }

    const allFiles = getAllFiles(docsDir)

    // Combine all files
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const relativePath = path.relative(docsDir, file).replace('.mdx', '')
      combined += `\n\n## ${relativePath}\n\n${content}`
    }

    // Update cache
    combinedDocsCache.content = combined
    combinedDocsCache.lastUpdated = Date.now()

    return combined
  } catch (error) {
    console.error('Error generating combined docs:', error)
    throw error
  }
}

export default createMiddleware(async ({ request, next }) => {
  const url = new URL(request.url)

  // Change /docs.md to /docs.txt
  if (url.pathname === '/docs.txt') {
    try {
      const combined = await getCombinedDocs()
      return new Response(combined, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch (error) {
      console.error('Error serving combined docs:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }

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
