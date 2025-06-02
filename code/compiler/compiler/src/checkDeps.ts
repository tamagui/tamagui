import { CDVC } from './check-dep-versions'

export enum DEPENDENCY_TYPE {
  dependencies = 'dependencies',
  devDependencies = 'devDependencies',
  optionalDependencies = 'optionalDependencies',
  peerDependencies = 'peerDependencies',
  resolutions = 'resolutions',
}

export type Options = {
  depType?: readonly `${DEPENDENCY_TYPE}`[] // Allow strings so the enum type doesn't always have to be used.
  fix?: boolean
  ignoreDep?: readonly string[]
  ignoreDepPattern?: readonly string[]
  ignorePackage?: readonly string[]
  ignorePackagePattern?: readonly string[]
  ignorePath?: readonly string[]
  ignorePathPattern?: readonly string[]
}

export async function checkDeps(root: string) {
  const summary = new CDVC(root).toMismatchSummary()

  if (!summary) {
    console.info(`Tamagui dependencies look good ✅`)
    process.exit(0)
  }

  console.error(summary)
  process.exit(1)
}
