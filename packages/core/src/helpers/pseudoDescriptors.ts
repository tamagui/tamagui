// *0 order matches to *1

export const pseudoDescriptors = {
  hoverStyle: {
    name: 'hover',
    stateKey: 'hover',
    priority: 1,
  },
  pressStyle: {
    name: 'active',
    stateKey: 'press',
    priority: 2,
  },
  focusStyle: {
    name: 'focus',
    stateKey: 'focus',
    priority: 3,
  },
  enterStyle: {
    name: 'enter',
    stateKey: 'enter',
    priority: 4,
  },
  exitStyle: {
    name: 'exit',
    stateKey: 'exit',
    priority: 4,
  },
} as const

export type PseudoDescriptor = typeof pseudoDescriptors[keyof typeof pseudoDescriptors]
