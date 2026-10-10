import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

// newest files win; history contains only fresh assets from each deployed build.
export function retainAssets(assets: string, snapshot: string, history: string[]) {
  rmSync(snapshot, { recursive: true, force: true })
  cpSync(assets, snapshot, { recursive: true })
  for (const previous of history.slice(0, 3)) {
    cpSync(previous, assets, { recursive: true, force: false, errorOnExist: false })
  }
}

if (import.meta.main) {
  const repository = process.env.GITHUB_REPOSITORY
  const name = process.env.ASSET_HISTORY_NAME
  if (!repository || !name) throw new Error('missing asset history repository or name')

  const { artifacts } = JSON.parse(
    execFileSync(
      'gh',
      [
        'api',
        `repos/${repository}/actions/artifacts?name=${encodeURIComponent(name)}&per_page=100`,
      ],
      { encoding: 'utf8' }
    )
  ) as { artifacts: { id: number; expired: boolean }[] }
  const previous = artifacts
    .filter((artifact) => !artifact.expired)
    .sort((a, b) => b.id - a.id)
    .slice(0, 3)

  const temporary = mkdtempSync(join(tmpdir(), 'site-assets-'))
  try {
    const history = previous.map(({ id }) => {
      const archive = join(temporary, `${id}.zip`)
      const directory = join(temporary, String(id))
      mkdirSync(directory)
      writeFileSync(
        archive,
        execFileSync('gh', ['api', `repos/${repository}/actions/artifacts/${id}/zip`], {
          maxBuffer: 256 * 1024 * 1024,
        })
      )
      execFileSync('unzip', ['-q', archive, '-d', directory])
      return directory
    })
    retainAssets('dist/client/assets', 'dist/asset-snapshot', history)
    console.info(`assets: retained ${history.length} previous deployed builds`)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
}
