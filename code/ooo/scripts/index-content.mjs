import { searchClient } from '@algolia/client-search'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { env } from 'node:process'
import path, { extname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { marked } from 'marked'
import slugify from 'slugify' // You might need to install this package

const client = searchClient('4XXMYD3SML', env.ALGOLIA_WRITE_API_KEY)
const isTestRun = env.TEST === 'true'

function createAnchor(text) {
  return slugify(text, { lower: true, strict: true })
}

function parseContentToRecords(content, url, frontmatterData) {
  const records = []
  const hierarchy = {
    lvl0: null,
    lvl1: null,
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
  }

  // Add frontmatter title as h1 if it exists
  if (frontmatterData.title) {
    hierarchy.lvl1 = frontmatterData.title
    records.push({
      objectID: `${url}#-${Date.now()}`,
      url: url,
      content: null,
      type: 'lvl1',
      hierarchy: { ...hierarchy },
      anchor: '',
    })
  }

  const tokens = marked.lexer(content)

  tokens.forEach((token) => {
    if (token.type === 'heading') {
      const level = token.depth
      hierarchy[`lvl${level}`] = token.text
      // Reset lower levels
      for (let i = level + 1; i <= 5; i++) {
        hierarchy[`lvl${i}`] = null
      }
      records.push({
        objectID: `${url}#${token.text.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        url: `${url}#${token.text.toLowerCase().replace(/\s+/g, '-')}`,
        content: null,
        type: `lvl${level}`,
        hierarchy: { ...hierarchy },
        anchor: createAnchor(token.text),
      })
    } else if (token.type === 'paragraph' || token.type === 'list') {
      records.push({
        objectID: `${url}#-${Date.now()}`,
        url: url,
        content: token.text,
        type: 'content',
        hierarchy: { ...hierarchy },
        anchor: '',
      })
    }
  })

  return records
}

async function processRecords(docsDirectory) {
  console.info('Searching for Markdown files in:', docsDirectory)
  const files = await readdir(docsDirectory)
  console.info(`Found ${files.length} files`)

  let allRecords = []

  for (const filename of files) {
    console.info(`Processing file: ${filename}`)
    if (extname(filename) !== '.mdx') {
      console.info(`Skipping non-markdown file: ${filename}`)
      continue
    }

    try {
      const fullPath = join(docsDirectory, filename)
      const fileContents = await readFile(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Generate slug from filename (removing .mdx extension)
      const slug = basename(filename, '.mdx')

      // Generate fully qualified URL
      const url = `https://onestack.dev/docs/${slug}`

      // Parse content to extract records, passing frontmatter data
      const records = parseContentToRecords(content, url, data).map((record) => ({
        ...record,
        ...data, // Include front-matter data
      }))

      allRecords = allRecords.concat(records)
      console.info(`Successfully processed: ${filename}`)
    } catch (error) {
      console.error(`Error processing file ${filename}:`, error)
    }
  }

  console.info(`Processed ${allRecords.length} records`)

  if (isTestRun) {
    await writeFile('test-output.json', JSON.stringify(allRecords, null, 2))
    console.info('Test run completed. Output written to test-output.json')
    return
  }

  try {
    if (!Array.isArray(allRecords) || allRecords.length === 0) {
      throw new Error('No valid records to save')
    }
    const results = await Promise.all(
      allRecords.map((record) =>
        client.saveObject(
          { body: record, indexName: 'one_docs' },
          {
            autoGenerateObjectIDIfNotExist: true,
          }
        )
      )
    )
    const result = {
      objectIDs: results.flatMap((r) => r.objectIDs),
      taskIDs: results.flatMap((r) => r.taskIDs),
    }
    console.info('Successfully indexed objects!', result)
  } catch (error) {
    console.error('Error saving objects to Algolia:', error)
  }
}

async function main() {
  try {
    const currentFilePath = fileURLToPath(import.meta.url)
    const docsDirectory = path.join(path.dirname(currentFilePath), '..', 'data', 'docs')
    const result = await processRecords(docsDirectory)
    console.info('Successfully indexed objects!', result)
  } catch (error) {
    console.error('Error processing records:', error)
  }
}

main()
