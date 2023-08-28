import { ToastViewport as ToastViewportOg } from '@my/ui'
import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { ToastViewportProps } from './ToastViewport'

export const ToastViewport = ({ noSafeArea }: ToastViewportProps) => {
  const { top, right, left } = useSafeAreaInsets()
  return (
    <ToastViewportOg
      top={noSafeArea ? 0 : top + 5}
      left={noSafeArea ? 0 : left + 5}
      right={noSafeArea ? 0 : right + 5}
    />
  )
}
