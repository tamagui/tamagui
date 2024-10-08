import * as proc from 'node:child_process'

export const spawn = proc.spawn

// could add only if changed checks: git diff --quiet HEAD HEAD~3 -- ./packages/core
// but at that point would be nicer to get a whole setup for this.. lerna or whatever
export const spawnify = async (
  cmd: string,
  opts?: proc.SpawnOptionsWithoutStdio & {
    avoidLog?: boolean
    cwd?: string
  }
): Promise<string> => {
  console.info('>', cmd)
  const [head, ...rest] = cmd.split(' ')
  return new Promise((res, rej) => {
    const { avoidLog, cwd, ...spawnOpts } = opts || {}
    const child = spawn(head, rest, {
      stdio: avoidLog ? undefined : ['inherit', 'pipe', 'pipe'],
      cwd,
      ...spawnOpts,
    })
    const outStr = []
    const errStr = []
    if (!avoidLog) {
      child.stdout!.pipe(process.stdout)
      child.stderr!.pipe(process.stderr)
    }
    child.stdout!.on('data', (out) => {
      // @ts-ignore
      outStr.push(`${out}`)
    })
    child.stderr!.on('data', (out) => {
      // @ts-ignore
      errStr.push(`${out}`)
    })
    child.on('error', (err) => {
      rej(err)
    })
    child.on('close', (code) => {
      if (code === 0) {
        res(outStr.join('\n'))
      } else {
        rej(errStr.join('\n'))
      }
    })
  })
}
