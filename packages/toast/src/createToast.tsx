import { isWeb } from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import React, { useRef } from 'react'

import { createNativeToast } from './createNativeToast'
import { CreateNativeToastsOptions, CreateNativeToastsOptionsFn } from './types'

type NativeValue = boolean | ('web' | 'mobile')
interface CreateToastOptions {
  native?: NativeValue
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
  currentToast: ({ title: string; id: string } & CreateNativeToastsOptions) | null
  addToast: CreateNativeToastsOptionsFn
}

const [createImperativeToastContext, createImperativeToastScope] =
  createContextScope('ImperativeToast')

const [ImperativeToastProvider, useToastProviderContext] =
  createImperativeToastContext<ImperativeToastContextValue>('ImperativeToastProvider')

const createToast = (options = {} as CreateToastOptions) => {
  return {
    ImperativeToastProvider: ({
      __scopeToast,
      children,
    }: ScopedProps<{ children: React.ReactNode }>) => {
      const counterRef = useRef(0)
      const [toast, setToast] =
        React.useState<ImperativeToastContextValue['currentToast']>(null)
      const addToast = React.useCallback<CreateNativeToastsOptionsFn>(
        (title, options) => {
          counterRef.current++
          setToast({ title, id: counterRef.current.toString(), ...options })
        },
        [setToast]
      )

      return (
        <ImperativeToastProvider
          scope={__scopeToast}
          addToast={addToast}
          currentToast={toast}
        >
          {children}
        </ImperativeToastProvider>
      )
    },
    useToast: () => {
      const context = useToastProviderContext('useToast', undefined)

      return {
        /**
         * The toast to get and show if not using native
         */
        currentToast: context.currentToast,
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
