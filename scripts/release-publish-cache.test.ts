import { afterEach, describe, expect, test } from 'bun:test'
import fs from 'fs-extra'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  getPublishArtifactPaths,
  getReusablePublishWorkspace,
} from './release-publish-cache'

const testDirs: string[] = []

afterEach(async () => {
  await Promise.all(testDirs.splice(0).map((dir) => fs.remove(dir)))
})

async function makeTmpDir() {
  const dir = await fs.mkdtemp(join(tmpdir(), 'tamagui-release-cache-'))
  testDirs.push(dir)
  return dir
}

describe('release publish cache', () => {
  test('reuses a matching tarball and prepared workspace', async () => {
    const dir = await makeTmpDir()
    const paths = getPublishArtifactPaths(dir, '@tamagui/button', '2.6.0')
    await fs.ensureDir(paths.workspaceDir)
    await fs.writeFile(paths.tarballPath, 'packed')
    await fs.writeJSON(join(paths.workspaceDir, 'package.json'), {
      name: '@tamagui/button',
      version: '2.6.0',
    })

    expect(await getReusablePublishWorkspace(dir, '@tamagui/button', '2.6.0')).toBe(
      'workspaces/@tamagui_button'
    )
  })

  test('rejects a cache entry with no tarball or a mismatched manifest', async () => {
    const dir = await makeTmpDir()
    const paths = getPublishArtifactPaths(dir, 'tamagui', '2.6.0')
    await fs.ensureDir(paths.workspaceDir)
    await fs.writeJSON(join(paths.workspaceDir, 'package.json'), {
      name: 'tamagui',
      version: '2.5.3',
    })

    expect(await getReusablePublishWorkspace(dir, 'tamagui', '2.6.0')).toBeNull()

    await fs.writeFile(paths.tarballPath, 'packed')
    expect(await getReusablePublishWorkspace(dir, 'tamagui', '2.6.0')).toBeNull()
  })
})
