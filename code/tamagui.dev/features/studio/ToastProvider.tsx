import type { ReactNode } from 'react'
import { Theme, Toast, toast, type ExternalToast } from 'tamagui'

// v3 removed the old imperative Toast (ToastProvider/ToastViewport/useToastController).
// This is a thin site-local adapter over the `toast()` + composable `<Toast>` API so
// the studio's many `toastController.show(title, { message })` call sites keep
// working. `message` maps to the new `description`.
type ShowOptions = Omit<ExternalToast, 'description'> & {
  message?: ReactNode
  demo?: boolean
  // the old API accepted arbitrary custom fields (customData, per-toast theme, …);
  // the styled Toast.List owns the look, so extra keys are accepted and ignored.
  customData?: Record<string, unknown>
  [key: string]: unknown
}

export const toastController = {
  show: (title: string, options?: ShowOptions) => {
    const { message, demo, customData, ...rest } = options ?? {}
    // studio previously suppressed demo toasts in its custom handler
    if (demo) return
    return toast(title, { description: message, ...(rest as ExternalToast) })
  },
  hide: () => {
    toast.dismiss()
  },
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Theme name="accent">
        <Toast position="bottom-center" swipeDirection="vertical">
          <Toast.Viewport>
            <Toast.List />
          </Toast.Viewport>
        </Toast>
      </Theme>
    </>
  )
}
