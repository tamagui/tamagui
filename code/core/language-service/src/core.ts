// The standalone Tamagui style tooling core.
//
// Browser-safe by contract: no node imports, no typescript imports. Everything
// here works from the serialized config JSON the Tamagui compiler emits
// (`.tamagui/tamagui.config.json`), so the same engine powers the tsserver
// plugin, the VS Code extension, the CLI checker, and in-browser IDEs.
//
// The @tamagui/style-grammar engine owns candidate meaning; this module adds
// the two things the engine's config view deliberately drops — token and theme
// VALUES — and projects everything into editor-shaped results: completions,
// diagnostics, hover, and color swatches.

import { normalizeCSSColor, rgba } from '@tamagui/normalize-css-color'
import {
  annotateStyleValue,
  completeStyleValueAtCursor,
  createCandidatePropertyVocabulary,
  createGrammarConfigViewFromSerializedConfig,
  createModifierRegistry,
  createStylePropSet,
  diagnoseStyleValueProgram,
  programEligibility,
  stateModifierNames,
  type DiagnoseStyleValueOptions,
  type ModifierKind,
  type SerializedGrammarSourceConfig,
  type StyleValueAnnotation,
  type StyleValueCompletion,
  type StyleValueCursorCompletions,
  type StyleValueDiagnostic,
} from '@tamagui/style-grammar/tooling'

export type {
  StyleValueAnnotation,
  StyleValueCompletion,
  StyleValueCursorCompletions,
  StyleValueDiagnostic,
}

/** the shape of the JSON artifact the Tamagui compiler writes */
export interface SerializedConfigFile {
  tamaguiConfig?: SerializedGrammarSourceConfig
  tamaguiConfigMetadata?: unknown
}

export interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface StyleValueColor {
  /** character span within the authored value */
  start: number
  end: number
  text: string
  color: RgbaColor
  /** the theme the preview value came from, when theme-resolved */
  theme?: string
}

export interface StyleValueHover {
  /** character span within the authored value */
  start: number
  end: number
  text: string
  /** markdown suitable for an editor hover */
  markdown: string
  /** a representative color for colorish targets */
  color?: RgbaColor
}

const modifierKindLabel: Readonly<Record<ModifierKind, string>> = {
  state: 'state modifier',
  media: 'media modifier',
  theme: 'theme modifier',
  platform: 'platform modifier',
  group: 'group modifier',
  container: 'container modifier',
}

const modifierKindSort: Readonly<Record<ModifierKind, string>> = {
  state: '00',
  group: '01',
  media: '02',
  container: '03',
  theme: '04',
  platform: '05',
}

const stateModifierSort = new Map(
  stateModifierNames.map((name, index) => [name, index] as const)
)

/**
 * The one sort key every host uses for completion entries, so ordering does
 * not drift between tsserver, LSP, and in-browser consumers: states first in
 * interaction order, then groups, media, containers, themes, platforms, then
 * configured values, then keywords.
 */
export function completionSortText(
  completion: StyleValueCompletion,
  modifierKind: ModifierKind | undefined
): string {
  if (modifierKind) {
    const stateOrder =
      modifierKind === 'state'
        ? `${String(stateModifierSort.get(completion.value) ?? 999).padStart(3, '0')}:`
        : ''
    return `${modifierKindSort[modifierKind]}:${stateOrder}${completion.value}`
  }
  return `${completion.kind === 'configured' ? '10' : '11'}:${completion.value}`
}

/** unwraps a compiler-serialized token variable to its raw value */
function tokenValue(entry: unknown): unknown {
  if (entry && typeof entry === 'object' && 'val' in entry) {
    return (entry as { val: unknown }).val
  }
  return entry
}

function parseColor(value: unknown, opacity?: number): RgbaColor | null {
  if (typeof value !== 'string') return null
  const normalized = normalizeCSSColor(value)
  if (normalized === null) return null
  const color = rgba(normalized)
  if (opacity !== undefined) color.a = color.a * (opacity / 100)
  return color
}

export interface StyleTooling {
  /** every prop name treated as a flat style value site */
  styleProps: ReadonlySet<string>
  /** engine options, for hosts that call @tamagui/style-grammar directly */
  engine: DiagnoseStyleValueOptions
  isStyleProp(name: string): boolean
  /** the longhand a prop resolves to through the configured shorthands */
  targetProperty(name: string): string
  /**
   * cursor completions for one value slot, or null when the property takes no
   * flat program (unknown props, legacy part props)
   */
  completions(
    property: string,
    value: string,
    cursor: number
  ): StyleValueCursorCompletions | null
  /** the complete static verdict for one authored value */
  diagnostics(property: string, value: string): readonly StyleValueDiagnostic[]
  /** classified spans: modifiers, tokens, keywords, literals */
  annotations(property: string, value: string): readonly StyleValueAnnotation[]
  /** hover content for the annotation under `offset`, or null */
  hover(property: string, value: string, offset: number): StyleValueHover | null
  /** every span that resolves to a presentable color */
  colors(property: string, value: string): readonly StyleValueColor[]
  /** the modifier kind of a registered modifier name */
  modifierKind(name: string): ModifierKind | undefined
  /** root theme names, preview themes first */
  previewThemes: readonly string[]
}

export function createStyleTooling(file: SerializedConfigFile): StyleTooling | null {
  const serialized = file.tamaguiConfig
  if (!serialized) return null

  const config = createGrammarConfigViewFromSerializedConfig(
    serialized,
    file.tamaguiConfigMetadata
  )
  const registry = createModifierRegistry(config).registry
  const candidates = createCandidatePropertyVocabulary(config)
  const engine: DiagnoseStyleValueOptions = { config, registry, candidates }
  const styleProps = createStylePropSet(config)

  // themes and tokens keep their VALUES here; the grammar view keeps names only
  const themes = (serialized.themes || {}) as Readonly<
    Record<string, Readonly<Record<string, unknown>> | undefined>
  >
  const rootThemes = Object.keys(themes).filter((name) => !name.includes('_'))
  const previewThemes = [
    ...['light', 'dark'].filter((name) => rootThemes.includes(name)),
    ...rootThemes.filter((name) => name !== 'light' && name !== 'dark'),
  ]
  const tokens = (serialized.tokens || {}) as Readonly<
    Record<string, Readonly<Record<string, unknown>> | undefined>
  >
  const media = (serialized.media || {}) as Readonly<Record<string, unknown>>

  const targetProperty = (name: string): string => config.shorthands?.[name] || name

  const themeValue = (name: string): { theme: string; value: unknown } | null => {
    for (const theme of previewThemes) {
      const value = themes[theme]?.[name]
      if (value !== undefined) return { theme, value }
    }
    return null
  }

  const annotationColor = (
    annotation: StyleValueAnnotation
  ): { color: RgbaColor; theme?: string } | null => {
    if (annotation.kind === 'token' || annotation.kind === 'identifier') {
      const name =
        annotation.opacity !== undefined
          ? annotation.text.slice(0, annotation.text.lastIndexOf('/'))
          : annotation.text
      if (annotation.tokenCategory === 'color') {
        const themed = themeValue(name)
        if (themed) {
          const color = parseColor(themed.value, annotation.opacity)
          return color ? { color, theme: themed.theme } : null
        }
        const color = parseColor(tokenValue(tokens.color?.[name]), annotation.opacity)
        return color ? { color } : null
      }
      if (annotation.kind === 'identifier') {
        // literal CSS colors: hex, rgb()/hsl() never annotate (functions are
        // skipped), but hex runs and named colors do
        const color = parseColor(name)
        return color ? { color } : null
      }
      return null
    }
    if (annotation.kind === 'keyword' && annotation.text === 'transparent') {
      return { color: { r: 0, g: 0, b: 0, a: 0 } }
    }
    return null
  }

  const annotations = (property: string, value: string) =>
    annotateStyleValue(property, value, engine)

  const formatRgba = (color: RgbaColor): string =>
    color.a === 1
      ? `rgb(${color.r}, ${color.g}, ${color.b})`
      : `rgba(${color.r}, ${color.g}, ${color.b}, ${Number(color.a.toFixed(3))})`

  return {
    styleProps,
    engine,
    previewThemes,
    isStyleProp: (name) => styleProps.has(name),
    targetProperty,
    modifierKind: (name) => registry.get(name),

    completions(property, value, cursor) {
      const target = targetProperty(property)
      if (programEligibility(target) === 'legacy-part') return null
      if (!styleProps.has(property)) return null
      return completeStyleValueAtCursor(property, value, cursor, engine)
    },

    diagnostics(property, value) {
      if (!styleProps.has(property)) return []
      return diagnoseStyleValueProgram(property, value, engine)
    },

    annotations,

    colors(property, value) {
      if (!styleProps.has(property)) return []
      const results: StyleValueColor[] = []
      for (const annotation of annotations(property, value)) {
        const resolved = annotationColor(annotation)
        if (!resolved) continue
        results.push({
          start: annotation.start,
          end: annotation.end,
          text: annotation.text,
          color: resolved.color,
          ...(resolved.theme !== undefined && { theme: resolved.theme }),
        })
      }
      return results
    },

    hover(property, value, offset) {
      if (!styleProps.has(property)) return null
      const annotation = annotations(property, value).find(
        (entry) => offset >= entry.start && offset <= entry.end
      )
      if (!annotation) return null

      const lines: string[] = []
      let color: RgbaColor | undefined

      if (annotation.kind === 'modifier' && annotation.modifierKind) {
        lines.push(
          `**${annotation.text}** · Tamagui ${modifierKindLabel[annotation.modifierKind]}`
        )
        if (annotation.modifierKind === 'media') {
          const query = media[annotation.text]
          if (query !== undefined) {
            lines.push('```json\n' + JSON.stringify(query) + '\n```')
          }
        }
      } else if (annotation.kind === 'token') {
        const name =
          annotation.opacity !== undefined
            ? annotation.text.slice(0, annotation.text.lastIndexOf('/'))
            : annotation.text
        if (annotation.tokenCategory === 'color') {
          lines.push(`**${name}** · Tamagui color`)
          let shown = 0
          for (const theme of previewThemes) {
            const value = themes[theme]?.[name]
            if (value === undefined || shown >= 4) continue
            shown++
            lines.push(`- ${theme}: \`${String(value)}\``)
          }
          if (shown === 0) {
            const value = tokenValue(tokens.color?.[name])
            if (value !== undefined) lines.push(`- \`${String(value)}\``)
          }
          if (annotation.opacity !== undefined) {
            lines.push(`- opacity: ${annotation.opacity}%`)
          }
        } else {
          const value = tokenValue(tokens[annotation.tokenCategory || '']?.[name])
          lines.push(
            `**${name}** · Tamagui ${annotation.tokenCategory} token` +
              (value !== undefined ? ` = \`${String(value)}\`` : '')
          )
        }
        const resolved = annotationColor(annotation)
        if (resolved) {
          color = resolved.color
          lines.push(`- resolves: \`${formatRgba(resolved.color)}\``)
        }
      } else if (annotation.kind === 'keyword') {
        lines.push(
          `**${annotation.text}** · CSS keyword` +
            (annotation.property ? ` for \`${annotation.property}\`` : '')
        )
      } else {
        const resolved = annotationColor(annotation)
        if (!resolved) return null
        color = resolved.color
        lines.push(
          `**${annotation.text}** · CSS color = \`${formatRgba(resolved.color)}\``
        )
      }

      return {
        start: annotation.start,
        end: annotation.end,
        text: annotation.text,
        markdown: lines.join('\n\n'),
        ...(color !== undefined && { color }),
      }
    },
  }
}
