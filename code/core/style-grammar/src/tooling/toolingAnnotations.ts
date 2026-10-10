// Classified source spans for one authored flat value.
//
// This is the read side of the tooling pipeline: where diagnostics say what is
// wrong, annotations say what everything IS — which spans are modifiers, which
// resolve to configured tokens (and through which category), which are style
// keywords, and which stay literal CSS. Hover, inline color swatches, and
// semantic highlighting all consume this one projection so no host re-derives
// candidate resolution on its own.

import { resolveCandidateTarget } from './candidateTarget'
import { resolvePayload } from '../ast/resolvePayload'
import {
  fontWeightNames,
  grammarEntries,
  standaloneValueProps,
  type TokenCategory,
} from './registry'
import {
  createCandidatePropertyVocabulary,
  modifierChainBefore,
  referenceKindFor,
  type DiagnoseStyleValueOptions,
} from './toolingDiagnostics'
import { parseValueWithSourceSpans } from '../ast/valueParser'
import { reservedCssIdents, type ModifierKind } from '../ast/valueTypes'

export type StyleValueAnnotationKind =
  /** a registered clause modifier (`hover`, `sm`, `dark`, `@md`) */
  | 'modifier'
  /** a candidate that resolves to a configured token or theme value */
  | 'token'
  /** a style keyword the grammar accepts for the target property, or a CSS-wide keyword */
  | 'keyword'
  /** an ident or hex color the config does not resolve; passes through as CSS */
  | 'identifier'

export interface StyleValueAnnotation {
  kind: StyleValueAnnotationKind
  /** character span within the authored value */
  start: number
  end: number
  text: string
  /** the clause modifier chain owning this slot; empty for the base value */
  modifiers?: readonly string[]
  /** for kind `modifier` */
  modifierKind?: ModifierKind
  /** for kind `token`: the category binding it to the target property */
  tokenCategory?: TokenCategory
  /** the resolved target property, when the candidate or keyword targets it */
  property?: string
  /** authored color opacity suffix percentage */
  opacity?: number
}

const grammarEntryByProp = new Map(grammarEntries.map((entry) => [entry.prop, entry]))

// the categories whose bare numbers resolve as tokens, per the resolver contract
const numericCategories: ReadonlySet<TokenCategory> = new Set([
  'space',
  'size',
  'radius',
  'zIndex',
])

const reservedFolded: ReadonlySet<string> = new Set(
  Array.from(reservedCssIdents, (ident) => ident.toLowerCase())
)

/**
 * Classifies every meaningful span in one authored value. Works on partially
 * invalid values too: whatever the parser could segment gets annotated, so
 * hover and colors keep working while the author types.
 */
export function annotateStyleValue(
  property: string,
  input: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueAnnotation[] {
  const targetProperty = options.config.shorthands?.[property] || property
  const entry = grammarEntryByProp.get(targetProperty)
  const candidates =
    options.candidates || createCandidatePropertyVocabulary(options.config)
  const { spans } = parseValueWithSourceSpans(input, options.registry)
  const annotations: StyleValueAnnotation[] = []

  for (const span of spans) {
    if (span.kind === 'modifier') {
      const name = input.slice(span.start, span.end)
      const modifierKind = options.registry.get(name)
      if (modifierKind) {
        annotations.push({
          kind: 'modifier',
          start: span.start,
          end: span.end,
          text: name,
          modifierKind,
        })
      }
      continue
    }
    if (span.kind !== 'base' && span.kind !== 'payload') continue
    if (span.start >= span.end) continue

    const modifiers =
      span.kind === 'payload' ? modifierChainBefore(input, spans, span.start) : []
    const payload = input.slice(span.start, span.end)

    resolvePayload(payload, {
      resolveNumbers:
        entry?.tokenCategory !== undefined && numericCategories.has(entry.tokenCategory),
      lookup(name) {
        const contributions = candidates.get(name)
        if (!contributions) return undefined
        return { name, kind: referenceKindFor(contributions, targetProperty) }
      },
      onCandidate(start, end, name, reference) {
        const at = {
          start: span.start + start,
          end: span.start + end,
          text: payload.slice(start, end),
          modifiers,
        }
        const contributions = reference && candidates.get(name)
        if (reference && contributions) {
          const target = resolveCandidateTarget(targetProperty, name, contributions)
          const contribution = target.ok ? target.contribution : contributions[0]
          annotations.push({
            kind: target.ok ? 'token' : 'identifier',
            ...at,
            tokenCategory: contribution.tokenCategory,
            ...(target.ok && { property: targetProperty }),
            ...(reference.opacity !== undefined && { opacity: reference.opacity }),
          })
          return
        }
        const keyword =
          standaloneValueProps[targetProperty]?.[name] !== undefined ||
          (targetProperty === 'fontWeight' && fontWeightNames[name] !== undefined) ||
          reservedFolded.has(name.toLowerCase())
        annotations.push({
          kind: keyword ? 'keyword' : 'identifier',
          ...at,
          ...(keyword && { property: targetProperty }),
        })
      },
    })
  }

  annotations.sort((a, b) => a.start - b.start)
  return annotations
}
