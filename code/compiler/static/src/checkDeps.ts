// @ts-ignore
import type { CDVC as Type } from 'check-dependency-version-consistency'

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

export async function checkDeps(root: string, options: Options) {
  const checker = await import('check-dependency-version-consistency')
  return new checker.CDVC(root, options) as Type
}
