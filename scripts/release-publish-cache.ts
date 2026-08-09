import fs from 'fs-extra'
import { join, relative } from 'node:path'

export function getPublishArtifactPaths(tmpDir: string, name: string, version: string) {
  const packageSlug = name.replace('@', '').replace('/', '-')
  const workspaceSlug = name.replace('/', '_')

  return {
    tarballPath: join(tmpDir, `${packageSlug}-${version}.tgz`),
    workspaceDir: join(tmpDir, 'workspaces', workspaceSlug),
  }
}

export async function getReusablePublishWorkspace(
  tmpDir: string,
  name: string,
  version: string
) {
  const { tarballPath, workspaceDir } = getPublishArtifactPaths(tmpDir, name, version)

  if (!(await fs.pathExists(tarballPath))) {
    return null
  }

  try {
    const manifest = await fs.readJSON(join(workspaceDir, 'package.json'))
    if (manifest.name === name && manifest.version === version) {
      return relative(tmpDir, workspaceDir)
    }
  } catch {}

  return null
}
