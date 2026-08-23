import type { GrammarConfigView } from './candidate'
import { grammarPlatformNames } from './config'
import { stateModifierNames } from './clauseIdentity'

export const configRevisionSymbol: unique symbol = Symbol.for(
  'tamagui.configRevision'
) as any

export const modifierKindState = 1
export const modifierKindMedia = 2
export const modifierKindPlatform = 3
export const modifierKindTheme = 4

export type CompiledModifierKind = 1 | 2 | 3 | 4
export type CompiledModifierVocabulary = Readonly<Record<string, CompiledModifierKind>>

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
  visit: (name: string) => void
): void {
  if (!source) return
  if (Array.isArray(source)) {
    for (const name of source) visit(name)
    return
  }
  if (source instanceof Set) {
    for (const name of source) visit(name)
    return
  }
  for (const name in source as Readonly<Record<string, unknown>>) {
    if (Object.prototype.hasOwnProperty.call(source, name)) visit(name)
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
  const names = Object.create(null) as Record<string, CompiledModifierKind>

  const register = (name: string, code: CompiledModifierKind): void => {
    if (name.charCodeAt(0) === 64) {
      onRefusal?.(modifierRefusalReservedContainerPrefix, name, code, 0)
      return
    }
    if (name.startsWith('group-')) {
      onRefusal?.(modifierRefusalReservedGroupPrefix, name, code, 0)
      return
    }
    const existing = names[name]
    if (existing !== undefined) {
      if (existing !== code) {
        onRefusal?.(modifierRefusalKindCollision, name, code, existing)
      }
      return
    }
    names[name] = code
    onRegistered?.(name)
  }

  for (const name of stateModifierNames) {
    register(name, modifierKindState)
  }
  forEachModifierName(view.mediaNames, (name) => register(name, modifierKindMedia))
  forEachModifierName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, modifierKindPlatform)
  )
  forEachModifierName(view.themeNames, (name) => {
    if (isRootThemeName(name)) register(name, modifierKindTheme)
  })

  return names
}
