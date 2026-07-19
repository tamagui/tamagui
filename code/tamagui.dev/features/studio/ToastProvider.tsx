import type { ReactNode } from 'react'
import { Theme, Toaster, toast, type ExternalToast } from 'tamagui'

// v3 removed the v1 imperative Toast (ToastProvider/ToastViewport/useToastController).
// This is a thin site-local adapter over the v2 `toast()` + `<Toaster/>` API so the
// studio's many `toastController.show(title, { message })` call sites keep working.
// `message` maps to the v2 `description`.
type ShowOptions = Omit<ExternalToast, 'description'> & {
  message?: ReactNode
  demo?: boolean
  // v1 accepted arbitrary custom fields (customData, per-toast theme, …); the v2
  // styled Toaster owns the look, so extra keys are accepted and ignored.
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
        <Toaster position="bottom-center" swipeDirection="vertical" />
      </Theme>
    </>
  )
}
