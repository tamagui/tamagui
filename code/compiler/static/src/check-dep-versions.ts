/**
 * "license": "MIT",
  "author": "Bryan Mishkin",
 */

import { globSync } from 'fast-glob'
import { load } from 'js-yaml'
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

type PackageJson = {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  resolutions?: Record<string, string>
  workspaces:
    | string[]
    | {
        packages?: string
      }
}

type DependenciesToVersionsSeen = Map<
  string,
  { package: Package; version: string; isLocalPackageVersion: boolean }[] // Array can't be readonly since we are adding to it.
>

/** A dependency, the versions present of it, and the packages each of those versions are seen in. */
type DependencyAndVersions = {
  dependency: string
  readonly versions: {
    version: string
    packages: readonly Package[]
  }[]
}

/**
 * Creates a map of each dependency in the workspace to an array of the packages it is used in.
 *
 * Example of such a map represented as an object:
 *
 * {
 *  'ember-cli': [
 *     { package: Package...'@scope/package1', version: '~3.18.0' },
 *     { package: Package...'@scope/package2', version: '~3.18.0' }
 *  ]
 *  'eslint': [
 *     { package: Package...'@scope/package1', version: '^7.0.0' },
 *     { package: Package...'@scope/package2', version: '^7.0.0' }
 *  ]
 * }
 */
function calculateVersionsForEachDependency(
  packages: readonly Package[],
  depType: readonly DEPENDENCY_TYPE[] = DEFAULT_DEP_TYPES
): DependenciesToVersionsSeen {
  const dependenciesToVersionsSeen: DependenciesToVersionsSeen = new Map<
    string,
    { package: Package; version: string; isLocalPackageVersion: boolean }[]
  >()
  for (const package_ of packages) {
    recordDependencyVersionsForPackageJson(dependenciesToVersionsSeen, package_, depType)
  }
  return dependenciesToVersionsSeen
}

// eslint-disable-next-line complexity
function recordDependencyVersionsForPackageJson(
  dependenciesToVersionsSeen: DependenciesToVersionsSeen,
  package_: Package,
  depType: readonly DEPENDENCY_TYPE[]
) {
  if (package_.packageJson.name && package_.packageJson.version) {
    recordDependencyVersion(
      dependenciesToVersionsSeen,
      package_.packageJson.name,
      package_.packageJson.version,
      package_,
      true
    )
  }

  if (
    depType.includes(DEPENDENCY_TYPE.dependencies) &&
    package_.packageJson.dependencies
  ) {
    for (const [dependency, dependencyVersion] of Object.entries(
      package_.packageJson.dependencies
    )) {
      if (dependencyVersion) {
        recordDependencyVersion(
          dependenciesToVersionsSeen,
          dependency,
          dependencyVersion,
          package_
        )
      }
    }
  }

  if (
    depType.includes(DEPENDENCY_TYPE.devDependencies) &&
    package_.packageJson.devDependencies
  ) {
    for (const [dependency, dependencyVersion] of Object.entries(
      package_.packageJson.devDependencies
    )) {
      if (dependencyVersion) {
        recordDependencyVersion(
          dependenciesToVersionsSeen,
          dependency,
          dependencyVersion,
          package_
        )
      }
    }
  }

  if (
    depType.includes(DEPENDENCY_TYPE.optionalDependencies) &&
    package_.packageJson.optionalDependencies
  ) {
    for (const [dependency, dependencyVersion] of Object.entries(
      package_.packageJson.optionalDependencies
    )) {
      if (dependencyVersion) {
        recordDependencyVersion(
          dependenciesToVersionsSeen,
          dependency,
          dependencyVersion,
          package_
        )
      }
    }
  }

  if (
    depType.includes(DEPENDENCY_TYPE.peerDependencies) &&
    package_.packageJson.peerDependencies
  ) {
    for (const [dependency, dependencyVersion] of Object.entries(
      package_.packageJson.peerDependencies
    )) {
      if (dependencyVersion) {
        recordDependencyVersion(
          dependenciesToVersionsSeen,
          dependency,
          dependencyVersion,
          package_
        )
      }
    }
  }

  if (depType.includes(DEPENDENCY_TYPE.resolutions) && package_.packageJson.resolutions) {
    for (const [dependency, dependencyVersion] of Object.entries(
      package_.packageJson.resolutions
    )) {
      if (dependencyVersion) {
        recordDependencyVersion(
          dependenciesToVersionsSeen,
          dependency,
          dependencyVersion,
          package_
        )
      }
    }
  }
}

function recordDependencyVersion(
  dependenciesToVersionsSeen: DependenciesToVersionsSeen,
  dependency: string,
  version: string,
  package_: Package,
  isLocalPackageVersion = false
) {
  if (!dependenciesToVersionsSeen.has(dependency)) {
    dependenciesToVersionsSeen.set(dependency, [])
  }
  const list = dependenciesToVersionsSeen.get(dependency)
  /* istanbul ignore if */
  if (list) {
    // `list` should always exist at this point, this if statement is just to please TypeScript.
    list.push({ package: package_, version, isLocalPackageVersion })
  }
}

function calculateDependenciesAndVersions(
  dependencyVersions: DependenciesToVersionsSeen
): readonly DependencyAndVersions[] {
  // Loop through all dependencies seen.
  return [...dependencyVersions.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .flatMap(([dependency, versionObjectsForDep]) => {
      /* istanbul ignore if */
      if (!versionObjectsForDep) {
        // Should always exist at this point, this if statement is just to please TypeScript.
        return []
      }

      // Check what versions we have seen for this dependency.
      let versions = versionObjectsForDep
        .filter((versionObject) => !versionObject.isLocalPackageVersion)
        .map((versionObject) => versionObject.version)

      // Check if this dependency is a local package.
      const localPackageVersions = versionObjectsForDep
        .filter((versionObject) => versionObject.isLocalPackageVersion)
        .map((versionObject) => versionObject.version)
      const allVersionsHaveWorkspacePrefix = versions.every((version) =>
        version.startsWith('workspace:')
      )
      const hasIncompatibilityWithLocalPackageVersion = versions.some(
        (version) => localPackageVersions[0] !== version
      )
      if (
        localPackageVersions.length === 1 &&
        !allVersionsHaveWorkspacePrefix &&
        hasIncompatibilityWithLocalPackageVersion
      ) {
        // If we saw a version for this dependency that isn't compatible with its actual local package version, add the local package version to the list of versions seen.
        // Note that using the `workspace:` prefix to refer to the local package version is allowed.
        versions = [...versions, ...localPackageVersions]
      }

      // Calculate unique versions seen for this dependency.
      const uniqueVersions = [...new Set(versions)]

      const uniqueVersionsWithInfo = versionsObjectsWithSortedPackages(
        uniqueVersions,
        versionObjectsForDep
      )
      return {
        dependency,
        versions: uniqueVersionsWithInfo,
      }
    })
}

function versionsObjectsWithSortedPackages(
  versions: readonly string[],
  versionObjects: readonly {
    package: Package
    version: string
    isLocalPackageVersion: boolean
  }[]
) {
  return versions.map((version) => {
    const matchingVersionObjects = versionObjects.filter(
      (versionObject) => versionObject.version === version
    )
    return {
      version,
      packages: matchingVersionObjects
        .map((object) => object.package)
        .sort((a, b) => Package.comparator(a, b)),
    }
  })
}

const HARDCODED_IGNORED_DEPENDENCIES = new Set([
  '//', // May be used to add comments to package.json files.
])

function filterOutIgnoredDependencies(
  mismatchingVersions: readonly DependencyAndVersions[],
  ignoredDependencies: readonly string[],
  includedDependencyPatterns: readonly RegExp[]
): readonly DependencyAndVersions[] {
  for (const ignoreDependency of ignoredDependencies) {
    if (
      !mismatchingVersions.some(
        (mismatchingVersion) => mismatchingVersion.dependency === ignoreDependency
      )
    ) {
      throw new Error(
        `Specified option '--ignore-dep ${ignoreDependency}', but no version mismatches detected for this dependency.`
      )
    }
  }

  if (
    ignoredDependencies.length > 0 ||
    includedDependencyPatterns.length > 0 ||
    mismatchingVersions.some((mismatchingVersion) =>
      HARDCODED_IGNORED_DEPENDENCIES.has(mismatchingVersion.dependency)
    )
  ) {
    return mismatchingVersions.filter(
      (mismatchingVersion) =>
        !ignoredDependencies.includes(mismatchingVersion.dependency) &&
        includedDependencyPatterns.some((ignoreDependencyPattern) =>
          mismatchingVersion.dependency.match(ignoreDependencyPattern)
        ) &&
        !HARDCODED_IGNORED_DEPENDENCIES.has(mismatchingVersion.dependency)
    )
  }

  return mismatchingVersions
}

function getPackages(
  root: string,
  ignorePackages: readonly string[],
  ignorePackagePatterns: readonly RegExp[],
  ignorePaths: readonly string[],
  ignorePathPatterns: readonly RegExp[]
): readonly Package[] {
  // Check for some error cases first.
  if (!Package.exists(root)) {
    throw new Error('No package.json found at provided path.')
  }

  const packages = accumulatePackages(root, ['.'])

  for (const ignoredPackage of ignorePackages) {
    if (
      !Package.some(packages, (package_) => package_.name === ignoredPackage) // eslint-disable-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
    ) {
      throw new Error(
        `Specified option '--ignore-package ${ignoredPackage}', but no such package detected in workspace.`
      )
    }
  }

  for (const ignoredPackagePattern of ignorePackagePatterns) {
    if (
      // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
      !Package.some(packages, (package_) => ignoredPackagePattern.test(package_.name))
    ) {
      throw new Error(
        `Specified option '--ignore-package-pattern ${String(
          ignoredPackagePattern
        )}', but no matching packages detected in workspace.`
      )
    }
  }

  for (const ignoredPath of ignorePaths) {
    if (
      // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
      !Package.some(packages, (package_) => package_.pathRelative.includes(ignoredPath))
    ) {
      throw new Error(
        `Specified option '--ignore-path ${ignoredPath}', but no matching paths detected in workspace.`
      )
    }
  }

  for (const ignoredPathPattern of ignorePathPatterns) {
    if (
      // eslint-disable-next-line unicorn/no-array-method-this-argument,unicorn/no-array-callback-reference -- false positive
      !Package.some(packages, (package_) =>
        ignoredPathPattern.test(package_.pathRelative)
      )
    ) {
      throw new Error(
        `Specified option '--ignore-path-pattern ${String(
          ignoredPathPattern
        )}', but no matching paths detected in workspace.`
      )
    }
  }

  if (
    ignorePackages.length > 0 ||
    ignorePackagePatterns.length > 0 ||
    ignorePaths.length > 0 ||
    ignorePathPatterns.length > 0
  ) {
    return packages.filter(
      (package_) =>
        !ignorePackages.includes(package_.name) &&
        !ignorePackagePatterns.some((ignorePackagePattern) =>
          package_.name.match(ignorePackagePattern)
        ) &&
        !ignorePaths.some((ignorePath) => package_.pathRelative.includes(ignorePath)) &&
        !ignorePathPatterns.some((ignorePathPattern) =>
          package_.pathRelative.match(ignorePathPattern)
        )
    )
  }

  return packages
}

// Expand workspace globs into concrete paths.
function expandWorkspaces(
  root: string,
  workspacePatterns: readonly string[]
): readonly string[] {
  return workspacePatterns.flatMap((workspace) => {
    if (!workspace.includes('*')) {
      return [workspace]
    }
    // Use cwd instead of passing join()'d paths to globby for Windows support: https://github.com/micromatch/micromatch/blob/34f44b4f57eacbdbcc74f64252e0845cf44bbdbd/README.md?plain=1#L822
    // Ignore any node_modules that may be present due to the use of nohoist.
    return globSync(workspace, {
      onlyDirectories: true,
      cwd: root,
      ignore: ['**/node_modules'],
    })
  })
}

// Recursively collect packages from a workspace.
function accumulatePackages(root: string, paths: readonly string[]): readonly Package[] {
  const results: Package[] = []
  for (const relativePath of paths) {
    const path = join(root, relativePath)
    if (Package.exists(path)) {
      const package_ = new Package(path, root)
      results.push(
        // Add the current package.
        package_,
        // Recursively add any nested workspace packages that might exist here.
        // This package is the new root.
        ...accumulatePackages(path, expandWorkspaces(path, package_.workspacePatterns))
      )
    }
  }
  return results
}

/*
 * Class to represent all of the information we need to know about a package in a workspace.
 */
class Package {
  /** Absolute path to package */
  path: string
  /** Absolute path to workspace.*/
  pathWorkspace: string
  /** Absolute path to package.json. */
  pathPackageJson: string
  packageJson: PackageJson
  packageJsonEndsInNewline: boolean
  pnpmWorkspacePackages?: readonly string[]

  constructor(path: string, pathWorkspace: string) {
    this.path = path
    this.pathWorkspace = pathWorkspace

    // package.json
    this.pathPackageJson = join(path, 'package.json')
    const packageJsonContents = readFileSync(this.pathPackageJson, 'utf8')
    this.packageJsonEndsInNewline = packageJsonContents.endsWith('\n')
    this.packageJson = JSON.parse(packageJsonContents) as PackageJson

    // pnpm-workspace.yaml
    const pnpmWorkspacePath = join(path, 'pnpm-workspace.yaml')
    if (existsSync(pnpmWorkspacePath)) {
      const pnpmWorkspaceContents = readFileSync(pnpmWorkspacePath, 'utf8')
      const pnpmWorkspaceYaml = load(pnpmWorkspaceContents) as {
        packages?: readonly string[]
      }
      this.pnpmWorkspacePackages = pnpmWorkspaceYaml.packages
    }
  }

  get name(): string {
    if (this.workspacePatterns.length > 0 && !this.packageJson.name) {
      return '(Root)'
    }
    if (!this.packageJson.name) {
      throw new Error(`${this.pathPackageJson} missing \`name\``)
    }
    return this.packageJson.name
  }

  /** Relative to workspace root. */
  get pathRelative(): string {
    return relative(this.pathWorkspace, this.path)
  }

  get workspacePatterns(): readonly string[] {
    if (this.packageJson.workspaces) {
      if (Array.isArray(this.packageJson.workspaces)) {
        return this.packageJson.workspaces
      } else if (this.packageJson.workspaces.packages) {
        if (!Array.isArray(this.packageJson.workspaces.packages)) {
          throw new TypeError('package.json `workspaces.packages` is not a string array.')
        }
        return this.packageJson.workspaces.packages
      } else {
        throw new TypeError('package.json `workspaces` is not a string array.')
      }
    }

    if (this.pnpmWorkspacePackages) {
      if (!Array.isArray(this.pnpmWorkspacePackages)) {
        throw new TypeError('pnpm-workspace.yaml `packages` is not a string array.')
      }
      return this.pnpmWorkspacePackages
    }

    return []
  }

  static exists(path: string): boolean {
    const packageJsonPath = join(path, 'package.json')
    return existsSync(packageJsonPath)
  }

  static some(
    packages: readonly Package[],
    callback: (package_: Package) => boolean
  ): boolean {
    return packages.some((package_) => callback(package_))
  }

  static comparator(package1: Package, package2: Package) {
    return package1.name.localeCompare(package2.name)
  }
}

/** Map of dependency name to information about the dependency. */
type Dependencies = Record<
  string,
  {
    isMismatching: boolean
    versions: readonly {
      version: string
      packages: readonly Package[]
    }[]
  }
>

enum DEPENDENCY_TYPE {
  dependencies = 'dependencies',
  devDependencies = 'devDependencies',
  optionalDependencies = 'optionalDependencies',
  peerDependencies = 'peerDependencies',
  resolutions = 'resolutions',
}

type Options = {
  depType?: readonly `${DEPENDENCY_TYPE}`[] // Allow strings so the enum type doesn't always have to be used.
  fix?: boolean
  ignoreDep?: readonly string[]
  includeDepPattern?: readonly string[]
  ignorePackage?: readonly string[]
  ignorePackagePattern?: readonly string[]
  ignorePath?: readonly string[]
  ignorePathPattern?: readonly string[]
}

const DEFAULT_DEP_TYPES = [
  DEPENDENCY_TYPE.dependencies,
  DEPENDENCY_TYPE.devDependencies,
  DEPENDENCY_TYPE.optionalDependencies,
  DEPENDENCY_TYPE.resolutions,
  // peerDependencies is not included by default, see discussion in: https://github.com/bmish/check-dependency-version-consistency/issues/402
]

/**
 * Checks for inconsistencies across a workspace. Optionally fixes them.
 * @param path - path to the workspace root
 * @param options
 * @param options.depType - Dependency type(s) to check
 * @param options.fix - Whether to autofix inconsistencies (using latest version present)
 * @param options.ignoreDep - Dependency(s) to ignore mismatches for
 * @param options.includeDepPattern - RegExp(s) of dependency names to ignore mismatches for
 * @param options.ignorePackage - Workspace package(s) to ignore mismatches for
 * @param options.ignorePackagePattern - RegExp(s) of package names to ignore mismatches for
 * @param options.ignorePath - Workspace-relative path(s) of packages to ignore mismatches for
 * @param options.ignorePathPattern - RegExp(s) of workspace-relative path of packages to ignore mismatches for
 * @returns an object with the following properties:
 * - `dependencies`: An object mapping each dependency in the workspace to information about it including the versions found of it.
 */
function check(path: string): {
  dependencies: Dependencies
} {
  const options: Options = {
    includeDepPattern: ['tamagui', 'react-native-web-lite', 'react-native-web-internals'],
  }

  if (
    options &&
    options.depType &&
    options.depType.some((dt) => !Object.keys(DEPENDENCY_TYPE).includes(dt))
  ) {
    throw new Error(
      `Invalid depType provided. Choices are: ${Object.keys(DEPENDENCY_TYPE).join(', ')}.`
    )
  }

  const optionsWithDefaults = {
    fix: false,
    ignoreDep: [],
    includeDepPattern: [],
    ignorePackage: [],
    ignorePackagePattern: [],
    ignorePath: [],
    ignorePathPattern: [],
    ...options,

    // Fallback to default if no depType(s) provided.
    depType:
      options && options.depType && options.depType.length > 0
        ? options.depType
        : DEFAULT_DEP_TYPES,
  }

  // Calculate.
  const packages = getPackages(
    path,
    optionsWithDefaults.ignorePackage,
    optionsWithDefaults.ignorePackagePattern.map((s) => new RegExp(s)),
    optionsWithDefaults.ignorePath,
    optionsWithDefaults.ignorePathPattern.map((s) => new RegExp(s))
  )

  const dependencies = calculateVersionsForEachDependency(
    packages,
    optionsWithDefaults.depType.map((dt) => DEPENDENCY_TYPE[dt]) // Convert string to enum.
  )
  const dependenciesAndVersions = calculateDependenciesAndVersions(dependencies)
  const dependenciesAndVersionsWithMismatches = dependenciesAndVersions.filter(
    ({ versions }) => versions.length > 1
  )

  // Information about all dependencies.
  const dependenciesAndVersionsWithoutIgnored = filterOutIgnoredDependencies(
    dependenciesAndVersions,
    optionsWithDefaults.ignoreDep,
    optionsWithDefaults.includeDepPattern.map((s) => new RegExp(s))
  )

  // Information about mismatches.
  const dependenciesAndVersionsMismatchesWithoutIgnored = filterOutIgnoredDependencies(
    dependenciesAndVersionsWithMismatches,
    optionsWithDefaults.ignoreDep,
    optionsWithDefaults.includeDepPattern.map((s) => new RegExp(s))
  )

  return {
    // Information about all dependencies.
    dependencies: Object.fromEntries(
      dependenciesAndVersionsWithoutIgnored.map(({ dependency, versions }) => {
        return [
          dependency,
          {
            isMismatching: dependenciesAndVersionsMismatchesWithoutIgnored.some(
              (dep) => dep.dependency === dependency
            ),
            versions,
          },
        ]
      })
    ),
  }
}

/** Relevant public data about a dependency. */
type Dependency = {
  name: string
  isMismatching: boolean
  versions: readonly {
    version: string
    packages: readonly { pathRelative: string }[]
  }[]
}

export class CDVC {
  /** An object mapping each dependency in the workspace to information including the versions found of it. */
  private readonly dependencies: Dependencies

  /**
   * @param path - path to the workspace root
   * @param options
   * @param options.fix - Whether to autofix inconsistencies (using latest version present)
   * @param options.ignoreDep - Dependency(s) to ignore mismatches for
   * @param options.includeDepPattern - RegExp(s) of dependency names to ignore mismatches for
   * @param options.ignorePackage - Workspace package(s) to ignore mismatches for
   * @param options.ignorePackagePattern - RegExp(s) of package names to ignore mismatches for
   * @param options.ignorePath - Workspace-relative path(s) of packages to ignore mismatches for
   * @param options.ignorePathPattern - RegExp(s) of workspace-relative path of packages to ignore mismatches for
   */
  constructor(path: string) {
    const { dependencies } = check(path)
    this.dependencies = dependencies
  }

  public toMismatchSummary(): string {
    return dependenciesToMismatchSummary(this.dependencies)
  }

  public getDependencies(): readonly Dependency[] {
    return Object.keys(this.dependencies).map((dependency) =>
      this.getDependency(dependency)
    )
  }

  public getDependency(name: string): Dependency {
    // Convert underlying dependency data object with relevant public data.
    return {
      name,
      isMismatching: this.dependencies[name].isMismatching,
      versions: this.dependencies[name].versions.map((version) => ({
        version: version.version,
        packages: version.packages.map((package_) => ({
          pathRelative: package_.pathRelative,
        })),
      })),
    }
  }

  public get hasMismatchingDependencies(): boolean {
    return Object.values(this.dependencies).some((dep) => dep.isMismatching)
  }
}

function dependenciesToMismatchSummary(dependencies: Dependencies): string {
  const mismatchingDependencyVersions = Object.entries(dependencies)
    .filter(([, value]) => value.isMismatching)
    .map(([dependency, value]) => ({ dependency, versions: value.versions }))

  if (mismatchingDependencyVersions.length === 0) {
    return ''
  }

  const tables = mismatchingDependencyVersions
    .map((object) => {
      return `${object.dependency} - ${object.versions.map((v) => `${v.version}`).join(', ')}`
    })
    .join('')

  return [
    `Found ${mismatchingDependencyVersions.length} ${
      mismatchingDependencyVersions.length === 1 ? 'dependency' : 'dependencies'
    } with mismatching versions across the workspace.`,
    tables,
  ].join('\n')
}
