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
  focusVisibleStyle: {
    name: 'focus-visible',
    priority: 3,
    stateKey: 'focusVisible',
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
  focusWithinStyle: {
    name: 'focus-within',
    priority: 3,
    stateKey: 'focusWithin',
  },
  disabledStyle: {
    name: 'disabled',
    priority: 4,
    stateKey: 'disabled',
  },
} as const

export const pseudoPriorities = {
  hover: 1,
  press: 2,
  focus: 3,
  focusVisible: 3,
  focusWithin: 3,
  disabled: 4,
}

export const pseudoDescriptors: Record<
  | 'hoverStyle'
  | 'pressStyle'
  | 'focusStyle'
  | 'focusVisibleStyle'
  | 'focusWithinStyle'
  | 'enterStyle'
  | 'exitStyle',
  PseudoDescriptor
> = {
  ...pseudoDescriptorsBase,
  enterStyle: {
    name: 'enter',
    selector: '.t_unmounted',
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
  selector?: string
}

export type PseudoDescriptors = {
  [Key in keyof typeof pseudoDescriptors]: PseudoDescriptor
}
