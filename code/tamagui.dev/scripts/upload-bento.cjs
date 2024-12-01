const { createClient } = require('@supabase/supabase-js')
const fs = require('node:fs')
const path = require('node:path')
const { glob } = require('glob')
require('dotenv').config({ path: '.env.local', override: true })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function uploadFile(relativePath) {
  const localPath = path.join(process.cwd(), 'bento-output', relativePath)
  const fileBuffer = fs.readFileSync(localPath)
  const { error } = await supabase.storage.from('bento').upload(relativePath, fileBuffer)
  if (error) {
    throw new Error(error.message)
  }
  console.info(`Uploaded ${relativePath}.`)
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

async function cleanUpPrevious(dir) {
  const filesToDelete = await getAllFilesInDirectoryRecursively(dir)
  if (filesToDelete.length) {
    const { error } = await supabase.storage.from('bento').remove(filesToDelete)
    if (error) {
      throw error
    }
    console.info(`Successfully deleted the old \`${dir}\` directory.`)
  }
}

async function main() {
  const globPattern = path.join(process.cwd(), 'bento-output', '**/*')
  await cleanUpPrevious('') // delete everything in the bucket
  await new Promise((resolve) => {
    glob(globPattern, { nodir: true }, async (error, matches) => {
      if (error) {
        throw error
      }

      for (const match of matches) {
        const relativePath = match.split('/bento-output/')[1]
        await uploadFile(relativePath)
      }

      resolve()
    })
  })
}

main()
