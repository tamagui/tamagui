import { isWeb } from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import React from 'react'

import { createNativeToast } from './createNativeToast'
import { CreateNativeToastsOptions, CreateNativeToastsOptionsFn } from './types'

type NativeValue = boolean | ('web' | 'mobile')
interface CreateToastOptions {
  native: NativeValue
}
interface ToastOptions extends CreateNativeToastsOptions {
  /**
   * Used when need custom data
   */
  additionalInfo?: Record<string, any>
  native?: NativeValue
}
type ScopedProps<P> = P & { __scopeToast?: Scope }

interface ImperativeToastContextValue {
  toasts: { title: string; options: CreateNativeToastsOptions }[]
  addToast: CreateNativeToastsOptionsFn
}

const [createImperativeToastContext, createImperativeToastScope] =
  createContextScope('ImperativeToast')

const [ImperativeToastProvider, useToastProviderContext] =
  createImperativeToastContext<ImperativeToastContextValue>('ImperativeToastProvider')

const createToast = (options: CreateToastOptions) => {
  return {
    ImperativeToastProvider: ({
      __scopeToast,
      children,
    }: ScopedProps<{ children: React.ReactNode }>) => {
      const [toasts, setToasts] = React.useState<ImperativeToastContextValue['toasts']>(
        []
      )
      const addToast = React.useCallback<CreateNativeToastsOptionsFn>(
        (title, options) => {
          setToasts((prev) => [...prev, { title, options: options ?? {} }])
        },
        [setToasts]
      )

      return (
        <ImperativeToastProvider scope={__scopeToast} addToast={addToast} toasts={toasts}>
          {children}
        </ImperativeToastProvider>
      )
    },
    useToasts: () => {
      const context = useToastProviderContext('useToast', undefined)

      return {
        toasts: context.toasts,
        show(title: string, showOptions?: ToastOptions) {
          const native = showOptions?.native || options.native
          if (
            native === true ||
            (Array.isArray(options.native) &&
              ((isWeb && options.native.includes('web')) ||
                (!isWeb && options.native.includes('mobile'))))
          ) {
            return createNativeToast(title, showOptions ?? {})
          }
          context.addToast(title, showOptions ?? {})
        },
      }
    },
  }
}

export { createToast }
export type { CreateToastOptions }
