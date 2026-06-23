import { getBurnt } from '@tamagui/native'
import type { CreateNativeToastsFn, HideNativeToastsFn } from './types'

export const createNativeToast: CreateNativeToastsFn = (
  title,
  { message, duration, burntOptions }
) => {
  const burnt = getBurnt()
  if (!burnt.isEnabled) {
    console.warn(
      `Warning: Must call import '@tamagui/native/setup-burnt' at your app entry point to use native toasts`
    )
    return false
  }

  burnt.state.toast!({
    title,
    message,
    duration: duration ? duration / 1000 : undefined,
    ...burntOptions,
  })
  return true
}

export const hideNativeToast: HideNativeToastsFn = () => {
  const burnt = getBurnt()
  if (!burnt.isEnabled) return
  burnt.state.dismissAllAlerts!()
}

export async function requestNotificationPermission(): Promise<null> {
  return null
}
