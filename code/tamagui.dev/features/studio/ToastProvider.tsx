import { toast, Toaster } from '@tamagui/toast'
import { Theme } from 'tamagui'

// expose toast for use outside react
export { toast as toastController }

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Theme name="accent">
        <Toaster position="bottom-center" />
      </Theme>
    </>
  )
}
