import React, { memo } from 'react'
import { RemoveScroll as RS } from 'react-remove-scroll'

export type RemoveScrollProps = React.ComponentProps<typeof RS>

const RSInner = (props: RemoveScrollProps) => {
  if (!props.children) return null
  return <RS {...props} />
}

export const RemoveScroll = memo(RSInner)

RSInner['classNames'] = RS.classNames
RemoveScroll['classNames'] = RS.classNames
