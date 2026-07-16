import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  resolutionKey,
  resolvedModuleId,
  type HostResolvedProject,
  type ProjectInput,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'

const fixtureRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../fixtures/project'
)

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? collectFiles(path) : [path]
    })
  )
  return files.flat()
}

function fixtureId(path: string): string {
  return `/${relative(fixtureRoot, path).replaceAll('\\', '/')}`
}

export async function loadFixtureProject(): Promise<ProjectInput> {
  const paths = (await collectFiles(fixtureRoot))
    .filter((path) => ['.ts', '.tsx'].includes(extname(path)))
    .sort()
  const files = new Map<string, string>()
  for (const path of paths) {
    files.set(fixtureId(path), await readFile(path, 'utf8'))
  }

  const resolutions = new Map<string, string>([
    [resolutionKey('/src/token-barrel.ts', './tokens'), '/src/tokens.ts'],
    [resolutionKey('/src/config.ts', '#tokens'), '/src/token-barrel.ts'],
    [resolutionKey('/src/config.ts', '@fixture/theme'), '/packages/theme/src/index.ts'],
    [resolutionKey('/src/App.tsx', './config'), '/src/config.ts'],
    [resolutionKey('/src/App.tsx', '@fixture/ui'), '/packages/ui/src/index.ts'],
    [resolutionKey('/src/App.compiled.ts', './config'), '/src/config.ts'],
    [resolutionKey('/src/App.compiled.ts', '@fixture/ui'), '/packages/ui/src/index.ts'],
    [resolutionKey('/src/App.create-element.ts', './config'), '/src/config.ts'],
    [
      resolutionKey('/src/App.create-element.ts', '@fixture/ui'),
      '/packages/ui/src/index.ts',
    ],
    [resolutionKey('/src/Parity.tsx', './config'), '/src/config.ts'],
    [resolutionKey('/src/Parity.tsx', '@fixture/ui'), '/packages/ui/src/index.ts'],
    [resolutionKey('/src/Parity.compiled.ts', './config'), '/src/config.ts'],
    [
      resolutionKey('/src/Parity.compiled.ts', '@fixture/ui'),
      '/packages/ui/src/index.ts',
    ],
    [resolutionKey('/src/Parity.create-element.ts', './config'), '/src/config.ts'],
    [
      resolutionKey('/src/Parity.create-element.ts', '@fixture/ui'),
      '/packages/ui/src/index.ts',
    ],
    [resolutionKey('/src/Styled.tsx', '@fixture/ui'), '/packages/ui/src/index.ts'],
    [resolutionKey('/src/Lower.tsx', '@fixture/ui'), '/packages/ui/src/index.ts'],
    [resolutionKey('/src/bailouts.ts', '#missing'), '/external/missing.ts'],
    [resolutionKey('/src/bailouts.ts', '@fixture/ui'), '/packages/ui/src/index.ts'],
  ])

  return { files, resolutions }
}

export async function loadHostFixtureProject(): Promise<HostResolvedProject> {
  const project = await loadFixtureProject()
  const hostProject = hostResolvedProjectFromInput(project)
  const externalImports = new Map<string, { specifier: string; resolvedId: string }[]>([
    [
      '/src/App.compiled.ts',
      [{ specifier: 'react/jsx-runtime', resolvedId: '/external/react-jsx-runtime.mjs' }],
    ],
    [
      '/src/App.create-element.ts',
      [{ specifier: 'react', resolvedId: '/external/react.mjs' }],
    ],
    [
      '/src/Parity.compiled.ts',
      [{ specifier: 'react/jsx-runtime', resolvedId: '/external/react-jsx-runtime.mjs' }],
    ],
    [
      '/src/Parity.create-element.ts',
      [{ specifier: 'react', resolvedId: '/external/react.mjs' }],
    ],
    [
      '/src/bailouts.ts',
      [{ specifier: 'react/jsx-runtime', resolvedId: '/external/react-jsx-runtime.mjs' }],
    ],
    [
      '/src/External.tsx',
      [{ specifier: '@external/ui', resolvedId: '/external/ui.mjs' }],
    ],
  ])
  return {
    modules: hostProject.modules.map((module) => ({
      ...module,
      imports: [
        ...module.imports,
        ...(externalImports.get(module.id) ?? []).map((dependency) => ({
          specifier: dependency.specifier,
          resolvedId: resolvedModuleId(dependency.resolvedId),
          external: true,
        })),
      ],
    })),
  }
}

export function hostResolvedProjectFromInput(project: ProjectInput): HostResolvedProject {
  const importsById = new Map<
    ResolvedModuleId,
    { specifier: string; resolvedId: ResolvedModuleId }[]
  >()
  for (const [key, value] of project.resolutions) {
    const separator = key.indexOf('\0')
    const id = resolvedModuleId(key.slice(0, separator))
    const specifier = key.slice(separator + 1)
    const imports = importsById.get(id) ?? []
    imports.push({ specifier, resolvedId: resolvedModuleId(value) })
    importsById.set(id, imports)
  }
  return {
    modules: [...project.files].map(([id, source]) => {
      const resolvedId = resolvedModuleId(id)
      return {
        id: resolvedId,
        source,
        imports: importsById.get(resolvedId) ?? [],
      }
    }),
  }
}

export function createGeneratedProject(size = 1_000): ProjectInput {
  if (size < 4 || size % 2 !== 0) {
    throw new Error(
      'Generated analyzer graph must contain an even number of at least four modules'
    )
  }

  const files = new Map<string, string>()
  const resolutions = new Map<string, string>()
  const secondRoot = size / 2
  files.set('/generated/module-0.ts', 'export const value0 = 1\n')
  files.set(`/generated/module-${secondRoot}.ts`, `export const value${secondRoot} = 1\n`)

  for (let index = 1; index < size; index++) {
    if (index === secondRoot) continue
    const id = `/generated/module-${index}.ts`
    const rootIndex = index < secondRoot ? 0 : secondRoot
    const root = `/generated/module-${rootIndex}.ts`
    files.set(
      id,
      `import { value${rootIndex} } from '#root'\nexport const value${index} = value${rootIndex} + ${index - rootIndex}\n`
    )
    resolutions.set(resolutionKey(id, '#root'), root)
  }

  return { files, resolutions }
}
