import { createMiddleware } from 'one'
import fs from 'node:fs'
import path from 'node:path'

// cache for component versions to avoid filesystem operations on every request
const componentVersionCache = new Map<string, string[]>()

// cache for llms.txt (full docs)
const llmsTxtCache = {
  content: '',
  lastUpdated: 0,
}

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllMdxFiles(fullPath))
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }
  return files
}

function getLlmsTxt() {
  // return cached version if less than 24 hours old (~1MB cached)
  if (Date.now() - llmsTxtCache.lastUpdated < 86400000 && llmsTxtCache.content) {
    return llmsTxtCache.content
  }

  const docsDir = path.join(process.cwd(), 'data/docs')
  let combined = '# Tamagui Complete Documentation\n\n'
  combined +=
    '> Tamagui is a complete UI solution for React Native and Web, with a fully-featured UI kit, styling engine, and optimizing compiler.\n\n'

  const allFiles = getAllMdxFiles(docsDir)

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const relativePath = path.relative(docsDir, file).replace('.mdx', '')
    combined += `\n\n## ${relativePath}\n\n${content}`
  }

  llmsTxtCache.content = combined
  llmsTxtCache.lastUpdated = Date.now()

  return combined
}

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
