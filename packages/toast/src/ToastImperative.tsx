import { isWeb } from '@tamagui/core'
import React, { createContext, useContext, useMemo, useRef } from 'react'
import { Platform } from 'react-native'

import { createNativeToast } from './createNativeToast'
import {
  CreateNativeToastOptions,
  NativeToastRef,
  ToastNativePlatform,
  ToastNativeValue,
} from './types'

interface ToastImperativeOptions extends Omit<CreateNativeToastOptions, 'message'> {
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

type ToastData = { title: string; id: string } & CreateNativeToastOptions & {
    isHandledNatively: boolean
  }

interface ToastContextI {
  nativeToast: NativeToastRef | null

  /**
   * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
   */
  showToast: (title: string, options?: ShowToastOptions) => boolean

  /**
   * Call it to hide the currently displayed toast.
   *
   * _NOTE_: does not work on Android native toasts
   *
   * _NOTE_: hides the last toast on web notification toasts
   */
  hideToast: () => void

  options?: ToastImperativeOptions
}

const ToastContext = createContext<ToastContextI>({} as any)
const ToastCurrentContext = createContext<ToastData | null>(null)

export const useToastController = () => {
  return useContext(ToastContext)
}

export const useToastState = () => {
  return useContext(ToastCurrentContext)
}

/** @deprecated use `useToastController` and `useToastState` instead to avoid performance pitfalls */
export const useToast = () => {
  return {
    ...useToastController(),
    currentToast: useToastState(),
  }
}

interface ToastImperativeProviderProps {
  children: React.ReactNode
  /**
   * Used to provide defaults to imperative API. Options can be overwritten when calling `show()`.
   */
  options: ToastImperativeOptions
}

export const ToastImperativeProvider = ({
  children,
  options,
}: ToastImperativeProviderProps) => {
  const counterRef = useRef(0)

  const [toast, setToast] = React.useState<ToastData | null>(null)

  const [lastNativeToastRef, setLastNativeToastRef] =
    React.useState<ToastContextI['nativeToast']>(null)

  const showToast = React.useCallback<ToastContextI['showToast']>(
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

  const contextValue = useMemo(() => {
    return {
      showToast,
      hideToast,
      nativeToast: lastNativeToastRef,
      options,
    }
  }, [showToast, hideToast, lastNativeToastRef, JSON.stringify(options || null)])

  const currentContextValue = useMemo(() => {}, [])

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastCurrentContext.Provider value={toast}>
        {children}
      </ToastCurrentContext.Provider>
    </ToastContext.Provider>
  )
}

export type { ToastImperativeProviderProps, ToastNativePlatform, ToastNativeValue }
