import type { GrammarConfigView } from './candidate'
import { grammarPlatformNames, grammarPlatformRank } from './config'
import { canonicalClauseModifier, stateModifierNames } from './clauseIdentity'
import { canonicalStateModifierNames } from './stateModifiers'

export const configRevisionSymbol: unique symbol = Symbol.for(
  'tamagui.configRevision'
) as any

export const modifierKindState = 1
export const modifierKindMedia = 2
export const modifierKindPlatform = 3
export const modifierKindTheme = 4

export type CompiledModifierKind = 1 | 2 | 3 | 4
export type CompiledModifierVocabulary = Readonly<Record<string, number>>

export const modifierRefusalReservedContainerPrefix = 1
export const modifierRefusalReservedGroupPrefix = 2
export const modifierRefusalKindCollision = 3

export type ModifierVocabularyRefusalCode = 1 | 2 | 3
export type ModifierVocabularyRefusalHandler = (
  code: ModifierVocabularyRefusalCode,
  name: string,
  kind: CompiledModifierKind,
  existing: CompiledModifierKind | 0
) => void

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export function forEachModifierName(
  source: Names | undefined,
  visit: (name: string, rank: number) => void
): void {
  if (!source) return
  let rank = 0
  if (Array.isArray(source)) {
    for (const name of source) visit(name, rank++)
    return
  }
  if (source instanceof Set) {
    for (const name of source) visit(name, rank++)
    return
  }
  for (const name in source as Readonly<Record<string, unknown>>) {
    visit(name, rank++)
  }
}

export function isRootThemeName(name: string): boolean {
  return name.length > 0 && !name.includes('_')
}

export function compileModifierVocabulary(
  view: GrammarConfigView,
  onRefusal?: ModifierVocabularyRefusalHandler,
  onRegistered?: (name: string) => void
): CompiledModifierVocabulary {
  const names = Object.create(null) as Record<string, number>

  const register = (name: string, code: number): void => {
    const kind = (code & 7) as CompiledModifierKind
    if (name.charCodeAt(0) === 64) {
      onRefusal?.(modifierRefusalReservedContainerPrefix, name, kind, 0)
      return
    }
    if (name.startsWith('group-')) {
      onRefusal?.(modifierRefusalReservedGroupPrefix, name, kind, 0)
      return
    }
    const existing = names[name]
    if (existing !== undefined) {
      if ((existing & 7) !== kind) {
        onRefusal?.(
          modifierRefusalKindCollision,
          name,
          kind,
          (existing & 7) as CompiledModifierKind
        )
      }
      return
    }
    names[name] = code
    onRegistered?.(name)
  }

  for (const name of stateModifierNames) {
    const rank = canonicalStateModifierNames.indexOf(canonicalClauseModifier(name))
    register(name, modifierKindState | (rank << 3))
  }
  forEachModifierName(view.mediaNames, (name, rank) =>
    register(name, modifierKindMedia | (rank << 3))
  )
  forEachModifierName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, modifierKindPlatform | (grammarPlatformRank(name) << 3))
  )
  forEachModifierName(view.themeNames, (name) => {
    if (isRootThemeName(name)) register(name, modifierKindTheme)
  })

  return names
}
