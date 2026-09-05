import type { MaterializedModule } from '@tamagui/compiler-core'
import path from 'node:path'

import type { CompilerComponentRegistry } from './compilerHost'
import {
  getComponentStaticConfigByName,
  type LoadedComponents,
} from './extractor/bundleConfig'

/**
 * Evaluate a host-resolved module and return its exports, or null when the
 * host cannot run it. Frontends supply this from their bundler's module runner
 * (Vite) or the static-evaluation require hooks (`evaluateComponentModule`).
 */
export type ComponentModuleEvaluator = (module: {
  id: string
  specifier: string
}) => Promise<Record<string, unknown> | null>

// `pkg`, `@scope/pkg`, and their subpaths. `@/x` and `~/x` are path aliases
const packageSpecifier = /^(?:@[^/@\s]+\/)?[^./~@\s][^/\s]*(?:\/|$)/

function isPackageSpecifier(specifier: string): boolean {
  return packageSpecifier.test(specifier)
}

/**
 * Finds the component modules a file uses that the configured `components`
 * list does not cover, evaluates each once, and registers what it exports so
 * lowering resolves them like configured ones. Owned by a frontend for the
 * life of a project generation; `prepare` runs between materialize and lower.
 */
export class ComponentDiscovery {
  /** null records a module that had no components or could not evaluate */
  readonly #discovered = new Map<string, LoadedComponents | null>()

  clear(): void {
    this.#discovered.clear()
  }

  /** host-resolved ids of every module discovery found components in */
  ids(): string[] {
    return [...this.#discovered]
      .filter(([, loaded]) => loaded !== null)
      .map(([id]) => id)
      .sort()
  }

  /** re-register everything found so far into a freshly built registry */
  seed(registry: CompilerComponentRegistry): void {
    for (const [id, loaded] of this.#discovered) {
      if (!loaded) continue
      registry.modulesById.set(id, id)
      registry.componentsByModule.set(id, loaded)
    }
  }

  async prepare(
    module: MaterializedModule,
    registry: CompilerComponentRegistry,
    evaluate: ComponentModuleEvaluator | undefined
  ): Promise<void> {
    if (!evaluate) return
    const seen = new Set<string>()
    const provenances = [
      ...module.elements.map((element) => element.component.provenance),
      ...module.styledDefinitions.map((definition) => definition.base.provenance),
    ]
    for (const provenance of provenances) {
      // a relative or aliased import is the app's own module: the graph
      // already models its styled definitions, and evaluating app code at
      // build time runs its side effects
      if (!provenance || !isPackageSpecifier(provenance.specifier)) continue
      const id = provenance.resolvedId.split(/[?#]/, 1)[0]
      if (seen.has(id) || registry.modulesById.has(id) || this.#discovered.has(id)) {
        continue
      }
      seen.add(id)
      if (!path.isAbsolute(id)) {
        this.#discovered.set(id, null)
        continue
      }
      let loaded: LoadedComponents | null = null
      try {
        const exports = await evaluate({ id, specifier: provenance.specifier })
        if (exports) {
          const nameToInfo = getComponentStaticConfigByName(
            id,
            (exports as { default?: unknown }).default ?? exports
          )
          if (Object.keys(nameToInfo).length) loaded = { moduleName: id, nameToInfo }
        }
      } catch (error) {
        if (process.env.DEBUG === 'tamagui') {
          console.info(`[tamagui] component discovery skipped ${id}:`, error)
        }
      }
      this.#discovered.set(id, loaded)
      if (loaded) {
        registry.modulesById.set(id, id)
        registry.componentsByModule.set(id, loaded)
      }
    }
  }
}
