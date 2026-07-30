export const pseudoToModifier: Readonly<Record<string, string>> = Object.freeze({
  hoverStyle: 'hover',
  pressStyle: 'press',
  focusStyle: 'focus',
  focusVisibleStyle: 'focus-visible',
  focusWithinStyle: 'focus-within',
  disabledStyle: 'disabled',
  enterStyle: 'enter',
  exitStyle: 'exit',
})

export const modifierAliases: Readonly<Record<string, string>> = Object.freeze({
  active: 'press',
})
