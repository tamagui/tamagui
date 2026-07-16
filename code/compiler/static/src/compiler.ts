import {
  CompilerSession,
  resolvedModuleId,
  yukuFactory,
  type AppliedLoweredModule,
  type CompilerTarget,
  type HostModuleInput,
  type LoweredModulePlan,
  type ResolvedModuleId,
  type StructuralModulePass,
} from '@tamagui/compiler-core'
import path from 'node:path'

import { createTamaguiCompilerHost } from './compilerHost'
import type { TamaguiProjectInfo } from './extractor/bundleConfig'

export interface CompilerProjectComponentModule {
  moduleName: string
  id: string
}

export interface CompilerProject {
  projectInfo: TamaguiProjectInfo
  componentModules: CompilerProjectComponentModule[]
  generation: string
}

export interface CompilerResolution {
  id: string
  external?: boolean
}

export interface CompilerInput {
  id: string
  source: string
  root: string
  target: CompilerTarget
  project: CompilerProject
  resolve(specifier: string, importer: string): Promise<CompilerResolution | null>
  load(id: string): Promise<string | null>
  structuralPass?: StructuralModulePass
}

export type CompilerUpdateInput = Omit<CompilerInput, 'structuralPass' | 'target'>

export interface CompilerResult {
  plan: LoweredModulePlan
  output: AppliedLoweredModule
  invalidatedIds: ResolvedModuleId[]
}

function cleanId(id: string): string {
  return id.split(/[?#]/, 1)[0]
}

function externalId(specifier: string): ResolvedModuleId {
  return resolvedModuleId(`external://${encodeURIComponent(specifier)}`)
}

function sourceCanBeLinked(root: string, id: string): boolean {
  const clean = cleanId(id)
  if (!path.isAbsolute(clean) || clean.includes('/node_modules/')) return false
  const relative = path.relative(root, clean)
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`))
}

/**
 * Long-lived host-resolved graph frontend. The adapter supplies every identity and
 * load result; compiler-core never guesses package, alias, or workspace resolution.
 */
export class CompilerFrontend {
  private readonly session = new CompilerSession()
  private queue: Promise<unknown> = Promise.resolve()

  compile(input: CompilerInput): Promise<CompilerResult> {
    const operation = this.queue.then(() => this.compileNow(input))
    this.queue = operation.catch(() => undefined)
    return operation
  }

  update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]> {
    const operation = this.queue.then(async () => {
      const { modules } = await this.buildTree(input)
      const invalidated = new Set<ResolvedModuleId>()
      for (const module of modules.values()) {
        for (const id of this.session.update(module)) invalidated.add(id)
      }
      return [...invalidated].sort()
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  has(id: string): boolean {
    return this.session.has(resolvedModuleId(cleanId(id)))
  }

  dependentsOf(id: string): ResolvedModuleId[] {
    return this.session.dependentsOf(resolvedModuleId(cleanId(id)))
  }

  remove(id: string) {
    return this.session.remove(resolvedModuleId(cleanId(id)))
  }

  parseCount(id: string): number {
    return this.session.parseCount(resolvedModuleId(cleanId(id)))
  }

  private async compileNow(input: CompilerInput): Promise<CompilerResult> {
    const { rootModule, modules } = await this.buildTree(input)
    const invalidated = new Set<ResolvedModuleId>()
    for (const module of modules.values()) {
      for (const id of this.session.update(module)) invalidated.add(id)
    }
    const projectInfo = input.project.projectInfo
    if (!projectInfo.tamaguiConfig || !projectInfo.components) {
      throw new Error('The compiler requires evaluated Tamagui config and components')
    }
    const host = createTamaguiCompilerHost({
      target: input.target,
      tamaguiConfig: projectInfo.tamaguiConfig,
      components: projectInfo.components,
      componentModules: input.project.componentModules.map((component) => ({
        moduleName: component.moduleName,
        resolvedId: cleanId(component.id),
      })),
    })
    const result = await this.session.compile({
      module: rootModule,
      adapter: {
        target: input.target,
        projectGeneration: input.project.generation,
        host,
        async load(id) {
          return modules.get(id) ?? null
        },
      },
      structuralPass: input.structuralPass,
    })
    for (const id of result.invalidatedIds) invalidated.add(id)
    return {
      plan: result.plan,
      output: result.output,
      invalidatedIds: [...invalidated].sort(),
    }
  }

  private async buildTree(input: CompilerUpdateInput): Promise<{
    rootModule: HostModuleInput
    modules: Map<ResolvedModuleId, HostModuleInput>
  }> {
    const componentBySpecifier = new Map(
      input.project.componentModules.map((component) => [
        component.moduleName,
        resolvedModuleId(cleanId(component.id)),
      ])
    )
    const modules = new Map<ResolvedModuleId, HostModuleInput>()
    const loading = new Set<ResolvedModuleId>()

    const loadModule = async (
      rawId: string,
      source: string
    ): Promise<HostModuleInput> => {
      const id = resolvedModuleId(cleanId(rawId))
      const existing = modules.get(id)
      if (existing) return existing
      if (loading.has(id)) {
        return { id, source, imports: [] }
      }
      loading.add(id)

      const imports: HostModuleInput['imports'][number][] = []
      for (const specifier of yukuFactory.scanImports(id, source)) {
        const configuredComponent = componentBySpecifier.get(specifier)
        if (configuredComponent) {
          imports.push({ specifier, resolvedId: configuredComponent, external: true })
          continue
        }

        const resolution = await input.resolve(specifier, id)
        if (!resolution) continue
        const canLink =
          !resolution.external && sourceCanBeLinked(input.root, resolution.id)
        const resolvedId = canLink
          ? resolvedModuleId(cleanId(resolution.id))
          : path.isAbsolute(cleanId(resolution.id))
            ? resolvedModuleId(cleanId(resolution.id))
            : externalId(specifier)
        imports.push({ specifier, resolvedId, external: !canLink })
        if (canLink && !modules.has(resolvedId) && !loading.has(resolvedId)) {
          const dependencySource = await input.load(resolution.id)
          if (dependencySource !== null) {
            await loadModule(resolution.id, dependencySource)
          }
        }
      }

      const module = { id, source, imports }
      modules.set(id, module)
      loading.delete(id)
      return module
    }

    const rootModule = await loadModule(input.id, input.source)
    return { rootModule, modules }
  }
}
