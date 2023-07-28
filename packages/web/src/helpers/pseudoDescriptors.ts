// *0 order matches to *1

export const pseudoDescriptors: Record<
  'hoverStyle' | 'pressStyle' | 'focusStyle' | 'enterStyle' | 'exitStyle',
  PseudoDescriptor
> = {
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
