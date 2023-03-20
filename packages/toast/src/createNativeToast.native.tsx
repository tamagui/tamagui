import { CreateNativeToastsOptions, CreateNativeToastsOptionsFn } from './types'

export const createNativeToast: CreateNativeToastsOptionsFn = (
  title,
  { message, duration, preset = 'done' }: CreateNativeToastsOptions
) => {
  // import inline to allow lazy usage of native dependecy:
  const Burnt = require('burnt')

  Burnt.toast({
    title,
    message: message ?? '',
    preset,
    duration,
  })
}
