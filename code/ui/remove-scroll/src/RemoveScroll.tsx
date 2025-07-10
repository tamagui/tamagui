import type { ReactNode } from 'react'
import { useDisableBodyScroll } from './useDisableScroll'

export type RemoveScrollProps = {
  enabled?: boolean
  children?: React.ReactNode
}

export const RemoveScroll = (props: RemoveScrollProps): ReactNode => {
  useDisableBodyScroll(Boolean(props.enabled))

  return props.children
}
