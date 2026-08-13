// Document-level orchestration: an extractor locates the style value sites in
// one source file, the core answers inside each site, and this module joins
// the two so every host (browser IDE, LSP wrapper, CLI checker) gets
// file-offset results from one code path.
//
// Extractors are pluggable because hosts already own a parse: the tsserver
// plugin walks TypeScript's AST, the eslint rule walks ESTree, soot's bundler
// holds sucrase tokens. Each adapter reduces its tree to the same StyleSite
// contract; nothing downstream re-parses.

import type {
  StyleTooling,
  StyleValueColor,
  StyleValueDiagnostic,
  StyleValueHover,
} from './core'
import type { StyleValueCursorCompletions } from './core'

/** one static string style value in a source file */
export interface StyleSite {
  /** the authored prop name (`bg`, `padding`) */
  property: string
  /** the cooked string value */
  value: string
  /** file offset of the value's first character (inside the quotes) */
  start: number
  /** file offset just past the value's last character */
  end: number
  /** how the site was authored, for hosts that filter */
  kind: 'jsx-attribute' | 'styled-property'
}

export type ExtractStyleSites = (
  source: string,
  fileName?: string
) => readonly StyleSite[]

export interface DocumentDiagnostic extends StyleValueDiagnostic {
  site: StyleSite
}

export interface DocumentColor extends StyleValueColor {
  site: StyleSite
}

export interface DocumentHover extends StyleValueHover {
  site: StyleSite
}

export interface DocumentCompletions extends StyleValueCursorCompletions {
  site: StyleSite
}

export interface DocumentStyleTooling {
  sites(source: string, fileName?: string): readonly StyleSite[]
  /** completions at a file offset, spans mapped to file offsets */
  completionsAt(
    source: string,
    offset: number,
    fileName?: string
  ): DocumentCompletions | null
  /** every diagnostic in the file, spans mapped to file offsets */
  diagnostics(source: string, fileName?: string): readonly DocumentDiagnostic[]
  /** hover at a file offset, span mapped to file offsets */
  hoverAt(source: string, offset: number, fileName?: string): DocumentHover | null
  /** every color swatch in the file, spans mapped to file offsets */
  colors(source: string, fileName?: string): readonly DocumentColor[]
}

export function createDocumentStyleTooling(
  tooling: StyleTooling,
  extract: ExtractStyleSites
): DocumentStyleTooling {
  const siteAt = (sites: readonly StyleSite[], offset: number): StyleSite | undefined =>
    sites.find((site) => offset >= site.start && offset <= site.end)

  return {
    sites: (source, fileName) => extract(source, fileName),

    completionsAt(source, offset, fileName) {
      const site = siteAt(extract(source, fileName), offset)
      if (!site) return null
      const completions = tooling.completions(
        site.property,
        site.value,
        offset - site.start
      )
      if (!completions) return null
      return {
        ...completions,
        replaceStart: site.start + completions.replaceStart,
        site,
      }
    },

    diagnostics(source, fileName) {
      const results: DocumentDiagnostic[] = []
      for (const site of extract(source, fileName)) {
        for (const diagnostic of tooling.diagnostics(site.property, site.value)) {
          results.push({
            ...diagnostic,
            index: site.start + diagnostic.index,
            start: site.start + diagnostic.start,
            end: site.start + diagnostic.end,
            site,
          })
        }
      }
      return results
    },

    hoverAt(source, offset, fileName) {
      const site = siteAt(extract(source, fileName), offset)
      if (!site) return null
      const hover = tooling.hover(site.property, site.value, offset - site.start)
      if (!hover) return null
      return {
        ...hover,
        start: site.start + hover.start,
        end: site.start + hover.end,
        site,
      }
    },

    colors(source, fileName) {
      const results: DocumentColor[] = []
      for (const site of extract(source, fileName)) {
        for (const color of tooling.colors(site.property, site.value)) {
          results.push({
            ...color,
            start: site.start + color.start,
            end: site.start + color.end,
            site,
          })
        }
      }
      return results
    },
  }
}
