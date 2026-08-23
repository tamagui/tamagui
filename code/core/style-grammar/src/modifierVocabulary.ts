import type { GrammarConfigView } from './candidate'
import { grammarPlatformNames } from './config'
import { stateModifierNames } from './clauseIdentity'
import type { ModifierKind } from './valueTypes'

export const configRevisionSymbol: unique symbol = Symbol.for(
  'tamagui.configRevision'
) as any

export const modifierKindState = 1
export const modifierKindMedia = 2
export const modifierKindPlatform = 3
export const modifierKindTheme = 4

export type CompiledModifierKind = 1 | 2 | 3 | 4
export type CompiledModifierVocabulary = Readonly<Record<string, CompiledModifierKind>>

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

export function modifierKindFromCode(
  code: CompiledModifierKind | undefined
): ModifierKind | undefined {
  if (code === modifierKindState) return 'state'
  if (code === modifierKindMedia) return 'media'
  if (code === modifierKindPlatform) return 'platform'
  if (code === modifierKindTheme) return 'theme'
}

export function compileModifierVocabulary(
  view: GrammarConfigView,
  diagnostics?: string[],
  completionNames?: string[]
): CompiledModifierVocabulary {
  const names = Object.create(null) as Record<string, CompiledModifierKind>

  const register = (
    name: string,
    code: CompiledModifierKind,
    kind: Exclude<ModifierKind, 'group' | 'container'>
  ): void => {
    if (name.charCodeAt(0) === 64) {
      diagnostics?.push(
        `modifier "${name}" is not registered: the "@" prefix is reserved for container query modifiers, so it cannot be a ${kind} name`
      )
      return
    }
    if (name.startsWith('group-')) {
      diagnostics?.push(
        `modifier "${name}" is not registered: the "group-" prefix is reserved for group state modifiers; rename this ${kind} name so it does not begin with "group-"`
      )
      return
    }
    const existing = names[name]
    if (existing !== undefined) {
      if (existing !== code) {
        diagnostics?.push(
          `modifier "${name}" is already registered as a ${modifierKindFromCode(existing)} modifier, so the ${kind} name is ignored`
        )
      }
      return
    }
    names[name] = code
    completionNames?.push(name)
  }

  for (const name of stateModifierNames) {
    register(name, modifierKindState, 'state')
  }
  forEachModifierName(view.mediaNames, (name) =>
    register(name, modifierKindMedia, 'media')
  )
  forEachModifierName(view.platformNames ?? grammarPlatformNames, (name) =>
    register(name, modifierKindPlatform, 'platform')
  )
  forEachModifierName(view.themeNames, (name) => {
    if (isRootThemeName(name)) register(name, modifierKindTheme, 'theme')
  })

  return names
}
