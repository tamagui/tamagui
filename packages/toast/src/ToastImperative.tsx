import { isWeb } from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import React, { useRef } from 'react'
import { Platform } from 'react-native'

import { createNativeToast } from './createNativeToast'
import {
  CreateNativeToastOptions,
  NativeToastRef,
  ToastNativePlatform,
  ToastNativeValue,
} from './types'

interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, "message"> {
  /**
   * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
   */
  native?: ToastNativeValue
}
interface ShowToastOptions extends CreateNativeToastOptions {
  /**
   * Used when need custom data
   */
  additionalInfo?: Record<string, any>
  /**
   * Overrides the native option on `ToastImperativeProvider`
   */
  native?: ToastNativeValue
}
type ScopedProps<P> = P & { __scopeToast?: Scope }

type ToastData = { title: string; id: string } & CreateNativeToastOptions & {
    isHandledNatively: boolean
  }

interface ImperativeToastContextValue {
  currentToast: ToastData | null
  nativeToast: NativeToastRef | null
  showToast: (title: string, options?: ShowToastOptions) => boolean
  hideToast: () => void
  options?: ToastImperativeOptions
}

const [createImperativeToastContext, createImperativeToastScope] =
  createContextScope('ImperativeToast')

const [ToastImperativeProviderProvider, useToastProviderContext] =
  createImperativeToastContext<ImperativeToastContextValue>('ToastImperativeProvider')

const useToast = () => {
  const context = useToastProviderContext('useToast', undefined)

  return {
    /**
     * The currently displaying toast
     */
    currentToast: context.currentToast,
    /**
     * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
     */
    show: context.showToast,
    /**
     * Call it to hide the currently displayed toast.
     * 
     * _NOTE_: does not work on Android native toasts
     * 
     * _NOTE_: hides the last toast on web notification toasts
     */
    hide: context.hideToast,
  }
}

interface ToastImperativeProviderProps {
  children: React.ReactNode
  /**
   * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
   */
  options: ToastImperativeOptions
}
const ToastImperativeProvider = ({
  children,
  options,
  __scopeToast,
}: ScopedProps<ToastImperativeProviderProps>) => {
  const counterRef = useRef(0)
  const [toast, setToast] =
    React.useState<ImperativeToastContextValue['currentToast']>(null)
  const [lastNativeToastRef, setLastNativeToastRef] =
    React.useState<ImperativeToastContextValue['nativeToast']>(null)
  const showToast = React.useCallback<ImperativeToastContextValue['showToast']>(
    (title, showToastOptions) => {
      const native = showToastOptions?.native ?? options.native
      const isWebNative = Array.isArray(native)
        ? native.includes('web')
        : native === 'web'
      const isMobileNative = Array.isArray(native)
        ? native.includes('mobile')
        : native === 'mobile'
      const isAndroidNative =
        isMobileNative ||
        (Array.isArray(native) ? native.includes('android') : native === 'android')
      const isIosNative =
        isMobileNative ||
        (Array.isArray(native) ? native.includes('ios') : native === 'ios')

      const isHandledNatively =
        native === true ||
        (isWeb && isWebNative) ||
        (!isWeb && isMobileNative) ||
        (Platform.OS === 'android' && isAndroidNative) ||
        (Platform.OS === 'ios' && isIosNative)

      if (isHandledNatively) {
        const nativeToastResult = createNativeToast(title, showToastOptions ?? {})
        if (typeof nativeToastResult === 'object' && nativeToastResult.nativeToastRef) {
          setLastNativeToastRef(nativeToastResult.nativeToastRef)
        }
      }
      counterRef.current++
      setToast({
        title,
        id: counterRef.current.toString(),
        ...showToastOptions,
        isHandledNatively,
      })
      return true
    },
    [setToast, options.native]
  )
  const hideToast = React.useCallback(() => {
    lastNativeToastRef?.close()
    setToast(null)
  }, [setToast, lastNativeToastRef])

  return (
    <ToastImperativeProviderProvider
      scope={__scopeToast}
      showToast={showToast}
      hideToast={hideToast}
      currentToast={toast}
      nativeToast={lastNativeToastRef}
      options={options}
    >
      {children}
    </ToastImperativeProviderProvider>
  )
}

export { ToastImperativeProvider, useToast }
export type { ToastImperativeProviderProps, ToastNativePlatform, ToastNativeValue }
