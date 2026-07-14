import {
  ProjectGraph,
  applyLoweredModule,
  lowerModule,
  materializeModule,
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
  private readonly graph = new ProjectGraph(yukuFactory, { modules: [] })
  private queue: Promise<unknown> = Promise.resolve()

  compile(input: CompilerInput): Promise<CompilerResult> {
    const operation = this.queue.then(() => this.compileNow(input))
    this.queue = operation.catch(() => undefined)
    return operation
  }

  update(input: CompilerUpdateInput): Promise<ResolvedModuleId[]> {
    const operation = this.queue.then(async () => {
      const { invalidated } = await this.install(input)
      return [...invalidated]
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  has(id: string): boolean {
    return this.graph.contentHash(resolvedModuleId(cleanId(id))) !== null
  }

  dependentsOf(id: string): ResolvedModuleId[] {
    return this.graph.dependentsOf(resolvedModuleId(cleanId(id)))
  }

  remove(id: string) {
    return this.graph.removeModule(resolvedModuleId(cleanId(id)))
  }

  parseCount(id: string): number {
    return this.graph.parseCount(resolvedModuleId(cleanId(id)))
  }

  private async compileNow(input: CompilerInput): Promise<CompilerResult> {
    const { id, invalidated } = await this.install(input)
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
    const plan = lowerModule({
      module: materializeModule(this.graph, id),
      source: input.source,
      target: input.target,
      host,
      options: { projectGeneration: input.project.generation },
      structuralPass: input.structuralPass,
    })
    return {
      plan,
      output: applyLoweredModule(input.source, id, plan),
      invalidatedIds: [...invalidated],
    }
  }

  private async install(input: CompilerUpdateInput): Promise<{
    id: ResolvedModuleId
    invalidated: Set<ResolvedModuleId>
  }> {
    const componentBySpecifier = new Map(
      input.project.componentModules.map((component) => [
        component.moduleName,
        resolvedModuleId(cleanId(component.id)),
      ])
    )
    const visited = new Set<ResolvedModuleId>()
    const invalidated = new Set<ResolvedModuleId>()

    const install = async (rawId: string, source: string): Promise<void> => {
      const id = resolvedModuleId(cleanId(rawId))
      if (visited.has(id)) return
      visited.add(id)

      const imports: HostModuleInput['imports'][number][] = []
      const linked: { id: ResolvedModuleId; source: string }[] = []
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
        if (canLink) {
          const dependencySource = await input.load(resolution.id)
          if (dependencySource !== null) {
            linked.push({ id: resolvedId, source: dependencySource })
          }
        }
      }

      for (const dependency of linked) await install(dependency.id, dependency.source)
      const update = this.graph.updateModule({ id, source, imports })
      for (const affected of update.invalidatedIds) invalidated.add(affected)
    }

    await install(input.id, input.source)
    const id = resolvedModuleId(cleanId(input.id))
    return { id, invalidated }
  }
}
