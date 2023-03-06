import * as Burnt from 'burnt'

import { CreateNativeToastsOptions, CreateNativeToastsOptionsFn } from './types'

export const createNativeToast: CreateNativeToastsOptionsFn = (
  title,
  { message, duration, preset = 'done' }: CreateNativeToastsOptions
) => {
  Burnt.toast({
    title,
    message: message ?? '',
    preset,
    duration,
  })
}
