import React from 'react'
import type { ComponentProps } from 'react'
import { RemoveScroll as RS } from 'react-remove-scroll'

export type RemoveScrollProps = ComponentProps<typeof RS>

export const RemoveScroll = React.memo((props: RemoveScrollProps) => {
  if (!props.children) return null
  return <RS {...props} />
})

export const classNames = RS.classNames
