import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const compareVersions = (v1: string, v2: string): number => {
  const v1Parts = v1.split('.').map(Number)
  const v2Parts = v2.split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1
    if (v1Parts[i] < v2Parts[i]) return -1
  }
  return 0
}

// Git merge driver receives: %O %A %B (ancestor, current, other)
const [, , ancestorPath, currentPath, otherPath] = process.argv

try {
  const [current, other] = await Promise.all([
    readFile(currentPath, 'utf8').then(JSON.parse),
    readFile(otherPath, 'utf8').then(JSON.parse),
  ])

  // Compare versions and take the higher one
  if (compareVersions(other.version, current.version) > 0) {
    current.version = other.version
  }

  await writeFile(currentPath, JSON.stringify(current, null, 2) + '\n')
  console.info('Successfully merged package.json versions')
} catch (error) {
  console.error('Error merging package.json:', error)
  process.exit(1)
}
