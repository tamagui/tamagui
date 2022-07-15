import React from 'react'
import { RemoveScroll as RS } from 'react-remove-scroll'

export type RemoveScrollProps = React.ComponentProps<typeof RS>

export const RemoveScroll = (props: RemoveScrollProps) => {
  return <RS {...props} />
}

RemoveScroll.classNames = RS.classNames
