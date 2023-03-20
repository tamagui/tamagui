import { ToastOptions as BurntToastOptions } from 'burnt/build/types'

export interface CreateNativeToastsOptions {
  /**
   * Body of the toast
   */
  message?: BurntToastOptions['message']
  /**
   * Only supported on native iOS driver
   */
  preset?: BurntToastOptions['preset']
  /**
   * Duration of toast
   */
  duration?: BurntToastOptions['duration']
}

export type CreateNativeToastsOptionsFn = (
  title: string,
  options: CreateNativeToastsOptions
) => void
