import type { Component, JSXElementConstructor, Ref } from 'react'

import type { TamaguiComponent } from '../types'

// gets the ref type of any type of react component

export type GetRef<C> = C extends TamaguiComponent<any, infer Ref>
  ? Ref
  : C extends new (
        props: any
      ) => Component
    ? InstanceType<C>
    : C extends abstract new (
          ...args: any
        ) => any
      ? InstanceType<C>
      : C extends Component
        ? C
        : (
              C extends JSXElementConstructor<{ ref?: infer R }>
                ? R
                : C extends keyof JSX.IntrinsicElements
                  ? JSX.IntrinsicElements[C]['ref']
                  : unknown
            ) extends Ref<infer T> | string | undefined
          ? T
          : unknown
