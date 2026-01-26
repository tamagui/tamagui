import { toast } from '@tamagui/toast'

// expose toast for use outside react
export { toast as toastController }

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
