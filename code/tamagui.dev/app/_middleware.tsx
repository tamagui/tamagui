import { createMiddleware } from 'one'
import fs from 'node:fs'
import path from 'node:path'

export default createMiddleware(async ({ request, next }) => {
  const url = new URL(request.url)

  // Check if the path ends with .md
  if (url.pathname.endsWith('.md')) {
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

      // Get the latest version of the component
      const versions = fs
        .readdirSync(componentDir)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace('.mdx', ''))
        .sort()
        .reverse()

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

  return next()
})
