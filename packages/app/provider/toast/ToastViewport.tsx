import { ToastViewport as ToastViewportOg } from '@my/ui'

export interface ToastViewportProps {
  noSafeArea?: boolean
}
export const ToastViewport = ({ noSafeArea }: ToastViewportProps) => {
  return (
    <ToastViewportOg
      left={noSafeArea ? 0 : 10}
      right={noSafeArea ? 0 : 10}
      top={noSafeArea ? 0 : 10}
    />
  )
}
