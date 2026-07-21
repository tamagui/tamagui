import { expect, test } from 'bun:test'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('reuses one web authentication result inside the npm process', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tamagui-webauth-test-'))
  const moduleDirectory = join(root, 'node_modules', 'npm-profile')

  try {
    await mkdir(moduleDirectory, { recursive: true })
    await writeFile(
      join(moduleDirectory, 'index.js'),
      `let calls = 0
module.exports.webAuthOpener = async () => ({ token: String(++calls) })
`
    )

    const process = Bun.spawn(
      [
        'node',
        '-e',
        `const profile = require('npm-profile'); Promise.all([profile.webAuthOpener(), profile.webAuthOpener()]).then(([first, second]) => { if (first.token !== '1' || second.token !== '1') process.exitCode = 1 })`,
      ],
      {
        cwd: root,
        env: {
          ...Bun.env,
          NODE_PATH: join(root, 'node_modules'),
          NODE_OPTIONS: `--require=${join(import.meta.dir, 'cache-npm-webauth.cjs')}`,
        },
        stdout: 'pipe',
        stderr: 'pipe',
      }
    )
    const [exitCode, , stderr] = await Promise.all([
      process.exited,
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ])

    expect(exitCode, stderr).toBe(0)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('npm publishes prepared packages through one workspace process', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tamagui-release-test-'))
  const first = join(root, 'first')
  const second = join(root, 'second')

  try {
    await Promise.all([mkdir(first), mkdir(second)])
    await Promise.all([
      writeFile(
        join(root, 'package.json'),
        JSON.stringify({ private: true, workspaces: ['first', 'second'] })
      ),
      writeFile(
        join(first, 'package.json'),
        JSON.stringify({ name: 'tamagui-release-test-first', version: '0.0.0' })
      ),
      writeFile(
        join(second, 'package.json'),
        JSON.stringify({ name: 'tamagui-release-test-second', version: '0.0.0' })
      ),
    ])

    const process = Bun.spawn(
      [
        'node',
        '-e',
        `const { spawnSync } = require('node:child_process'); const result = spawnSync('npm', ['publish', '--workspaces', '--ignore-scripts', '--dry-run', '--loglevel', 'notice'], { encoding: 'utf8' }); const output = result.stdout + result.stderr; if (result.status !== 0 || !output.includes('tamagui-release-test-first') || !output.includes('tamagui-release-test-second')) process.exitCode = 1`,
      ],
      {
        cwd: root,
        env: {
          ...Bun.env,
          NODE_OPTIONS: `--require=${join(import.meta.dir, 'cache-npm-webauth.cjs')}`,
        },
        stdout: 'pipe',
        stderr: 'pipe',
      }
    )
    const [exitCode, , stderr] = await Promise.all([
      process.exited,
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ])

    expect(exitCode, stderr).toBe(0)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
