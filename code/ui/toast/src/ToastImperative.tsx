import React from 'react'
import type { NativePlatform, NativeValue } from '@tamagui/core'
import { isWeb } from '@tamagui/core'

import { Platform } from 'react-native'

import { createNativeToast } from './createNativeToast'
import type { CreateNativeToastOptions, NativeToastRef } from './types'

export interface ToastImperativeOptions
  extends Omit<CreateNativeToastOptions, 'message'> {
  /**
   * Will show a native toast if is true or is set to the current platform. On iOS, it wraps `SPIndicator` and `SPAlert`. On Android, it wraps `ToastAndroid`. On web, it wraps Notification API. Mobile's native features are handled by `burnt`.
   */
  native?: NativeValue
}

/**
 * Override this in your application to get custom toast fields.
 *
 * e.g.
 * ```ts
 * declare module '@tamagui/toast' {
 *   interface CustomData {
 *     preset: 'error' | 'success'
 *     isUrgent: true
 *   }
 * }
 *```
 * You will get auto-completion:
 * ```ts
 * toast.show("Message", { preset: 'error', isUrgent: true })
 * ```
 */
export interface CustomData {
  [key: string]: any
}

type ShowOptions = CreateNativeToastOptions &
  CustomData & {
    /**
     * Used when need custom data
     * @deprecated Use `customData` instead
     */
    additionalInfo?: CustomData
    /**
     * Used when need custom data
     */
    customData?: CustomData
    /**
     * Overrides the native option on `ToastImperativeProvider`
     */
    native?: NativeValue
    /**
     * Which viewport to send this toast to. This is only intended to be used with custom toasts and you should wire it up when creating the toast.
     */
    viewportName?: string | 'default'
  }

type ToastData = { title: string; id: string } & ShowOptions & {
    isHandledNatively: boolean
  } & CustomData

interface ToastContextI {
  nativeToast: NativeToastRef | null

  /**
   * Call it to show a new toast. If you're using native toasts, you can pass native options using \`burntOptions\` or \`notificationOptions\` depending on the native platform (mobile/web).
   */
  show: (title: string, options?: ShowOptions) => boolean

  /**
   * Call it to hide the currently displayed toast.
   *
   * _NOTE_: does not work on Android native toasts
   *
   * _NOTE_: hides the last toast on web notification toasts
   */
  hide: () => void

  options?: ToastImperativeOptions
}

const ToastContext = React.createContext<ToastContextI>({} as any)
const ToastCurrentContext = React.createContext<ToastData | null>(null)

export const useToastController = () => {
  return React.useContext(ToastContext)
}

export const useToastState = () => {
  return React.useContext(ToastCurrentContext)
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
  const counterRef = React.useRef(0)

  const [toast, setToast] = React.useState<ToastData | null>(null)

  const [lastNativeToastRef, setLastNativeToastRef] =
    React.useState<ToastContextI['nativeToast']>(null)

  const show = React.useCallback<ToastContextI['show']>(
    (title, showOptions) => {
      const native = showOptions?.native ?? options.native
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
        const nativeToastResult = createNativeToast(title, showOptions ?? {})
        if (typeof nativeToastResult === 'object' && nativeToastResult.nativeToastRef) {
          setLastNativeToastRef(nativeToastResult.nativeToastRef)
        }
      }
      counterRef.current++
      setToast({
        ...showOptions?.customData,
        ...showOptions,
        viewportName: showOptions?.viewportName ?? 'default',
        title,
        id: counterRef.current.toString(),
        isHandledNatively,
      })
      return true
    },
    [setToast, JSON.stringify(options.native || null)]
  )
  const hide = React.useCallback(() => {
    lastNativeToastRef?.close()
    setToast(null)
  }, [setToast, lastNativeToastRef])

  const contextValue = React.useMemo(() => {
    return {
      show,
      hide,
      nativeToast: lastNativeToastRef,
      options,
    }
  }, [show, hide, lastNativeToastRef, JSON.stringify(options || null)])

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastCurrentContext.Provider value={toast}>
        {children}
      </ToastCurrentContext.Provider>
    </ToastContext.Provider>
  )
}

export type { ToastImperativeProviderProps, NativePlatform, NativeValue }
