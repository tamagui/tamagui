import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/**
 * The cross-build CSS coordinator.
 *
 * A zero-runtime build owns exactly one CSS artifact. It holds the config CSS,
 * the zero entry's compiler atomic CSS, every island child build's atomic CSS,
 * and every theme-bridge class. `TAMAGUI_DID_OUTPUT_CSS` is derived from this
 * object's completeness, never set by an author, so the JavaScript stripping
 * fact and its replacement asset cannot diverge.
 */
export class ZeroCSSArtifact {
  #config: string | null = null
  #zero = new Map<string, string>()
  #islands = new Map<string, Map<string, string>>()
  #bridges = new Map<string, string>()
  #expectedIslands: readonly string[] = []
  #cssPath: string

  constructor(cssPath: string) {
    this.#cssPath = cssPath
  }

  get cssPath() {
    return this.#cssPath
  }

  expectIslands(ids: readonly string[]) {
    this.#expectedIslands = [...ids].sort()
  }

  setConfigCSS(css: string) {
    this.#config = css
  }

  setZeroModuleCSS(moduleId: string, css: string) {
    if (css) this.#zero.set(moduleId, css)
    else this.#zero.delete(moduleId)
  }

  setIslandModuleCSS(islandId: string, moduleId: string, css: string) {
    let bucket = this.#islands.get(islandId)
    if (!bucket) {
      bucket = new Map()
      this.#islands.set(islandId, bucket)
    }
    if (css) bucket.set(moduleId, css)
    else bucket.delete(moduleId)
  }

  /** This island's collected rules, in deterministic module order. */
  islandCSS(islandId: string): string[] {
    const bucket = this.#islands.get(islandId)
    if (!bucket) return []
    return [...bucket.keys()].sort().map((moduleId) => bucket.get(moduleId)!)
  }

  /** Marks an island as compiled even when it contributed no atomic rules. */
  markIslandComplete(islandId: string) {
    if (!this.#islands.has(islandId)) this.#islands.set(islandId, new Map())
  }

  /** Collected zero-graph module CSS, for an integration that persists it. */
  zeroModuleEntries(): [string, string][] {
    return [...this.#zero.entries()].sort(([left], [right]) => (left < right ? -1 : 1))
  }

  bridgeEntries(): [string, string][] {
    return [...this.#bridges.entries()].sort(([left], [right]) => (left < right ? -1 : 1))
  }

  setBridgeRules(bridgeId: string, css: string) {
    if (css) this.#bridges.set(bridgeId, css)
    else this.#bridges.delete(bridgeId)
  }

  clearGraphs() {
    this.#zero.clear()
    this.#islands.clear()
    this.#bridges.clear()
  }

  /** The missing pieces that block deriving TAMAGUI_DID_OUTPUT_CSS. */
  missing(): string[] {
    const missing: string[] = []
    if (this.#config === null) missing.push('config CSS')
    for (const id of this.#expectedIslands) {
      if (!this.#islands.has(id)) missing.push(`island ${id}`)
    }
    return missing
  }

  isComplete() {
    return this.missing().length === 0
  }

  /** Deterministic order: config, zero atomic, island atomic, bridge classes. */
  css(): string {
    const parts: string[] = []
    if (this.#config) parts.push(this.#config)
    for (const moduleId of [...this.#zero.keys()].sort()) {
      parts.push(this.#zero.get(moduleId)!)
    }
    for (const islandId of [...this.#islands.keys()].sort()) {
      const bucket = this.#islands.get(islandId)!
      for (const moduleId of [...bucket.keys()].sort()) parts.push(bucket.get(moduleId)!)
    }
    for (const bridgeId of [...this.#bridges.keys()].sort()) {
      parts.push(this.#bridges.get(bridgeId)!)
    }
    return parts.join('\n')
  }

  hash(): string {
    return createHash('sha256').update(this.css()).digest('hex').slice(0, 16)
  }

  /**
   * Writes the artifact and returns whether the derived
   * `TAMAGUI_DID_OUTPUT_CSS='1'` claim is now legal.
   */
  write(): { path: string; hash: string; complete: boolean; missing: string[] } {
    const missing = this.missing()
    const css = this.css()
    mkdirSync(path.dirname(this.#cssPath), { recursive: true })
    let existing: string | null = null
    try {
      existing = readFileSync(this.#cssPath, 'utf8')
    } catch {
      existing = null
    }
    if (existing !== css) writeFileSync(this.#cssPath, css)
    return {
      path: this.#cssPath,
      hash: this.hash(),
      complete: missing.length === 0,
      missing,
    }
  }
}
