// *0 order matches to *1

export const pseudoDescriptorsBase = {
  // order of keys here important! in priority order
  hoverStyle: {
    name: 'hover',
    priority: 1,
  },
  pressStyle: {
    name: 'active',
    stateKey: 'press',
    priority: 2,
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
} as const

export const pseudoPriorities = {
  hover: 1,
  press: 2,
  focus: 3,
}

export const pseudoDescriptors: Record<
  'hoverStyle' | 'pressStyle' | 'focusStyle' | 'enterStyle' | 'exitStyle',
  PseudoDescriptor
> = {
  ...pseudoDescriptorsBase,
  enterStyle: {
    name: 'enter',
    stateKey: 'unmounted',
    priority: 4,
  },
  exitStyle: {
    name: 'exit',
    priority: 5,
  },
}

export type PseudoDescriptor = {
  name: string
  priority: number
  stateKey?: string
}

export type PseudoDescriptors = {
  [Key in keyof typeof pseudoDescriptors]: PseudoDescriptor
}
