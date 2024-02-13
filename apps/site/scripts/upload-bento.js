const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
require('dotenv').config({ path: '.env.local', override: true })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function uploadFile(filePath) {
  const fileBuffer = fs.readFileSync(path.join(process.cwd(), 'bento-output', filePath))
  const fullPath = path.join('components', filePath)
  await supabase.storage.from('bento').upload(fullPath, fileBuffer)
  console.info(`Uploaded ${fullPath}.`)
}

async function getAllFilesInDirectoryRecursively(dir) {
  const { data, error } = await supabase.storage.from('bento').list(dir)
  if (error) {
    throw error
  }
  // results with `metadata` are files, the ones without are directories
  const components = data
    .filter((item) => item.metadata)
    .map((item) => path.join(dir, item.name))
  // recursively check the child directories
  const nestedComponents = (
    await Promise.all(
      data
        .filter((item) => !item.metadata)
        .map((item) => getAllFilesInDirectoryRecursively(path.join(dir, item.name)))
    )
  ).reduce((acc, item) => [...acc, ...item], [])

  return [...components, ...nestedComponents]
}

async function cleanUpPrevious() {
  const filesToDelete = await getAllFilesInDirectoryRecursively('components')
  if (filesToDelete.length) {
    const { error } = await supabase.storage.from('bento').remove(filesToDelete)
    if (error) {
      throw error
    }
    console.info('Successfully deleted the old `components` directory.')
  }
}

async function main() {
  const globPattern = path.join(process.cwd(), 'bento-output', '**/*.tsx')
  await cleanUpPrevious()
  await new Promise((resolve) => {
    glob(globPattern, async (error, txtFiles) => {
      if (error) {
        throw error
      }
      await Promise.all(
        txtFiles.map((filePath) => uploadFile(filePath.split('/bento-output/')[1]))
      )
      resolve()
    })
  })
}

main()
