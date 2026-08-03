import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

const lockDirectory = '/tmp/tamagui-bench.lock'
const ownerPath = join(lockDirectory, 'HOLD')

interface BenchmarkLockOwner {
  sessionId: string
  pid: number
  purpose: string
  acquiredAt: string
}

function readOwner(): BenchmarkLockOwner | null {
  try {
    const value = JSON.parse(readFileSync(ownerPath, 'utf8')) as BenchmarkLockOwner
    return typeof value.sessionId === 'string' &&
      Number.isInteger(value.pid) &&
      value.pid > 0 &&
      typeof value.purpose === 'string' &&
      typeof value.acquiredAt === 'string'
      ? value
      : null
  } catch {
    return null
  }
}

function processIsRunning(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== 'ESRCH'
  }
}

export function acquireBenchmarkLock(purpose: string) {
  const owner: BenchmarkLockOwner = {
    sessionId: process.env.AGENTBUS_SESSION || 'unwrapped',
    pid: process.pid,
    purpose,
    acquiredAt: new Date().toISOString(),
  }

  while (true) {
    try {
      mkdirSync(lockDirectory)
      try {
        writeFileSync(ownerPath, `${JSON.stringify(owner, null, 2)}\n`, { flag: 'wx' })
      } catch (error) {
        rmSync(lockDirectory, { recursive: true, force: true })
        throw error
      }
      break
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error

      const currentOwner = readOwner()
      if (!currentOwner) {
        throw new Error(
          `${lockDirectory} exists without valid HOLD metadata; refusing to reclaim because owner liveness cannot be established`
        )
      }
      if (processIsRunning(currentOwner.pid)) {
        throw new Error(
          `benchmark lock held by ${currentOwner.sessionId} (pid ${currentOwner.pid}) for ${currentOwner.purpose} since ${currentOwner.acquiredAt}`
        )
      }

      const abandonedDirectory = `${lockDirectory}.abandoned-${process.pid}-${Date.now()}`
      try {
        renameSync(lockDirectory, abandonedDirectory)
      } catch (renameError) {
        if ((renameError as NodeJS.ErrnoException).code === 'ENOENT') continue
        throw renameError
      }
      console.warn(
        `reclaiming benchmark lock from dead owner ${currentOwner.sessionId} (pid ${currentOwner.pid})`
      )
      rmSync(abandonedDirectory, { recursive: true, force: true })
    }
  }

  let released = false
  const release = () => {
    if (released) return
    released = true
    process.removeListener('exit', release)
    process.removeListener('SIGINT', handleInterrupt)
    process.removeListener('SIGTERM', handleTerminate)

    const currentOwner = readOwner()
    if (
      currentOwner?.pid === owner.pid &&
      currentOwner.sessionId === owner.sessionId &&
      currentOwner.acquiredAt === owner.acquiredAt
    ) {
      rmSync(lockDirectory, { recursive: true, force: true })
    }
  }
  const handleSignal = (signal: 'SIGINT' | 'SIGTERM') => {
    release()
    process.kill(process.pid, signal)
  }
  const handleInterrupt = () => handleSignal('SIGINT')
  const handleTerminate = () => handleSignal('SIGTERM')

  process.once('exit', release)
  process.once('SIGINT', handleInterrupt)
  process.once('SIGTERM', handleTerminate)

  return release
}
