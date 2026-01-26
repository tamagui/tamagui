import fs from 'node:fs'
import path from 'node:path'
import { apiRoute } from '~/features/api/apiRoute'

// cache for combined docs
const combinedDocsCache = {
  content: '',
  lastUpdated: 0,
}

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

function getCombinedDocs() {
  // return cached version if less than 1 hour old
  if (Date.now() - combinedDocsCache.lastUpdated < 3600000 && combinedDocsCache.content) {
    return combinedDocsCache.content
  }

  const docsDir = path.join(process.cwd(), 'data/docs')
  let combined = '# Tamagui Complete Documentation\n\n'

  const allFiles = getAllFiles(docsDir)

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const relativePath = path.relative(docsDir, file).replace('.mdx', '')
    combined += `\n\n## ${relativePath}\n\n${content}`
  }

  combinedDocsCache.content = combined
  combinedDocsCache.lastUpdated = Date.now()

  return combined
}

export default apiRoute(async () => {
  try {
    const combined = getCombinedDocs()
    return new Response(combined, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error serving combined docs:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
