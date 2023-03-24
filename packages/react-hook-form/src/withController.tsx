import { composeEventHandlers, composeRefs } from '@tamagui/web'
import { forwardRef } from 'react'
import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form'

export function withController<TProps>(
  Component: React.JSXElementConstructor<TProps>,
  mapProps: Partial<Record<keyof ControllerRenderProps, keyof TProps>> = {}
) {
  return forwardRef(function controlled(
    props: TProps & Omit<ControllerProps, 'render' | 'control'>,
    ref,
  ) {
    const { name, rules, shouldUnregister, defaultValue, ...propsComponent } = props

    return (
      <Controller
        name={name}
        rules={rules}
        shouldUnregister={shouldUnregister}
        defaultValue={defaultValue}
        render={({ field: { ref: innerRef, ...field }, fieldState}) => {
          const propsMapped = Object.keys(field).reduce((acc, keyFrom) => {
            const keyTo = mapProps[keyFrom]
            const propFrom = field[keyFrom]
            acc[keyTo ?? keyFrom] = propFrom
            return acc
          }, {})
          return <Component {...(propsComponent as TProps)} {...propsMapped} />
        }}
      />
    )
  })
}
