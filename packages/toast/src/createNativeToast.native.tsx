import { BurntToastOptions, CreateNativeToastsFn, HideNativeToastsFn } from './types'

export const createNativeToast: CreateNativeToastsFn = (
  title,
  { message, duration, burntOptions }
) => {
  // import inline to allow lazy usage of native dependecy:
  const Burnt: { toast: (options: BurntToastOptions) => any } = require('burnt')

  Burnt.toast({
    title,
    message,
    duration: duration ? duration * 1000 : undefined,
    ...burntOptions,
  })
  return true
}

export const hideNativeToast: HideNativeToastsFn = () => {
  const Burnt: { dismissAllAlerts: () => any } = require('burnt')
  Burnt.dismissAllAlerts()
}
