export const coreStateModifierNames = Object.freeze([
  'hover',
  'press',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
] as const)

export type CoreStateModifierName = (typeof coreStateModifierNames)[number]

export const modifierAliases: Readonly<Record<string, string>> = Object.freeze({
  active: 'press',
})
