import React from 'react'
import { RemoveScroll as RS } from 'react-remove-scroll'

export type RemoveScrollProps = React.ComponentProps<typeof RS>

export const RemoveScroll = (props: RemoveScrollProps) => {
  if (!props.children) return null
  if (props.enabled) console.warn('removing scroll')
  return <RS {...props} />
}

RemoveScroll.classNames = RS.classNames
