import type { CreateNativeToastsFn, HideNativeToastsFn } from './types'

export const createNativeToast: CreateNativeToastsFn = (
  title,
  { message, duration, burntOptions }
) => {
  // import inline to allow lazy usage of native dependecy:
  const Burnt = require('burnt') as typeof import('burnt')

  Burnt.toast({
    title,
    message,
    duration: duration ? duration / 1000 : undefined,
    ...burntOptions,
  })
  return true
}

export const hideNativeToast: HideNativeToastsFn = () => {
  const Burnt = require('burnt') as typeof import('burnt')
  Burnt.dismissAllAlerts()
}
