import type React from 'react'
import type { CreateNativeToastOptions, NativeToastRef } from './types'

// counter for generating unique toast ids
let toastsCounter = 1

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastT {
  id: string | number
  title: React.ReactNode | (() => React.ReactNode)
  description?: React.ReactNode | (() => React.ReactNode)
  type?: ToastType
  icon?: React.ReactNode
  jsx?: React.ReactElement
  dismissible?: boolean
  duration?: number
  promise?: PromiseT
  action?: ToastAction
  cancel?: ToastAction
  closeButton?: boolean
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
  // internal
  delete?: boolean
  // style overrides
  style?: React.CSSProperties
  className?: string
  // native options
  burntOptions?: CreateNativeToastOptions['burntOptions']
  notificationOptions?: CreateNativeToastOptions['notificationOptions']
  /** Custom user data */
  data?: Record<string, unknown>
}

export interface ToastAction {
  label: string
  onClick?: (event: React.MouseEvent) => void
}

export interface ToastToDismiss {
  id: string | number
  dismiss: true
}

export type ExternalToast = Omit<
  ToastT,
  'id' | 'title' | 'type' | 'delete' | 'promise'
> & {
  id?: string | number
}

export type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>)

export interface PromiseData<Data = any> {
  loading?: React.ReactNode | (() => React.ReactNode)
  success?: React.ReactNode | ((data: Data) => React.ReactNode)
  error?: React.ReactNode | ((error: any) => React.ReactNode)
  description?: React.ReactNode | ((data: any) => React.ReactNode)
  finally?: () => void
}

type TitleT = React.ReactNode | (() => React.ReactNode)

/**
 * Observer class that manages toast state globally.
 * Follows the pattern from Sonner for a clean, decoupled architecture.
 */
class Observer {
  subscribers: Array<(toast: ToastT | ToastToDismiss) => void> = []
  toasts: ToastT[] = []
  dismissedToasts: Set<string | number> = new Set()

  /**
   * Subscribe to toast state changes.
   * Returns an unsubscribe function.
   */
  subscribe = (subscriber: (toast: ToastT | ToastToDismiss) => void) => {
    this.subscribers.push(subscriber)

    return () => {
      const index = this.subscribers.indexOf(subscriber)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  /**
   * Publish a toast to all subscribers
   */
  publish = (data: ToastT) => {
    this.subscribers.forEach((subscriber) => subscriber(data))
  }

  /**
   * Add a new toast to the internal array and publish to subscribers
   */
  addToast = (data: ToastT) => {
    this.publish(data)
    this.toasts = [...this.toasts, data]
  }

  /**
   * Create or update a toast
   */
  create = (
    data: ExternalToast & {
      title?: TitleT
      type?: ToastType
      promise?: PromiseT
      jsx?: React.ReactElement
    }
  ) => {
    const { title, ...rest } = data
    const id =
      typeof data?.id === 'number' || (typeof data?.id === 'string' && data.id.length > 0)
        ? data.id
        : toastsCounter++

    const alreadyExists = this.toasts.find((toast) => toast.id === id)
    const dismissible = data.dismissible ?? true

    // if this toast was previously dismissed, clear that
    if (this.dismissedToasts.has(id)) {
      this.dismissedToasts.delete(id)
    }

    if (alreadyExists) {
      // update existing toast
      this.toasts = this.toasts.map((toast) => {
        if (toast.id === id) {
          this.publish({ ...toast, ...data, id, title, dismissible })
          return { ...toast, ...data, id, title, dismissible }
        }
        return toast
      })
    } else {
      this.addToast({ title, ...rest, dismissible, id } as ToastT)
    }

    return id
  }

  /**
   * Dismiss a toast by id, or all toasts if no id provided
   */
  dismiss = (id?: string | number) => {
    if (id !== undefined) {
      this.dismissedToasts.add(id)
      // use requestAnimationFrame to batch updates
      requestAnimationFrame(() => {
        this.subscribers.forEach((subscriber) => subscriber({ id, dismiss: true }))
      })
    } else {
      // dismiss all
      this.toasts.forEach((toast) => {
        this.subscribers.forEach((subscriber) =>
          subscriber({ id: toast.id, dismiss: true })
        )
      })
    }

    return id
  }

  /**
   * Show a basic toast message
   */
  message = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'default' })
  }

  /**
   * Show a success toast
   */
  success = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'success' })
  }

  /**
   * Show an error toast
   */
  error = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'error' })
  }

  /**
   * Show a warning toast
   */
  warning = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'warning' })
  }

  /**
   * Show an info toast
   */
  info = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'info' })
  }

  /**
   * Show a loading toast
   */
  loading = (title: TitleT, data?: ExternalToast) => {
    return this.create({ ...data, title, type: 'loading' })
  }

  /**
   * Show a toast for a promise, automatically transitioning through
   * loading -> success/error states
   */
  promise = <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) => {
    if (!data) {
      return
    }

    let id: string | number | undefined = undefined

    // show loading state if provided
    if (data.loading !== undefined) {
      id = this.create({
        promise,
        type: 'loading',
        title: data.loading,
        description:
          typeof data.description !== 'function' ? data.description : undefined,
        // loading toasts shouldn't auto-dismiss
        duration: Number.POSITIVE_INFINITY,
      })
    }

    const p = Promise.resolve(promise instanceof Function ? promise() : promise)

    let shouldDismiss = id !== undefined
    let result: ['resolve', ToastData] | ['reject', unknown]

    const originalPromise = p
      .then(async (response) => {
        result = ['resolve', response]

        // check if response is an HTTP error
        if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false
          const errorMsg =
            typeof data.error === 'function'
              ? await data.error(`HTTP error! status: ${response.status}`)
              : data.error
          const description =
            typeof data.description === 'function'
              ? await data.description(`HTTP error! status: ${response.status}`)
              : data.description

          this.create({ id, type: 'error', title: errorMsg, description })
        } else if (data.success !== undefined) {
          shouldDismiss = false
          const successMsg =
            typeof data.success === 'function'
              ? await data.success(response)
              : data.success
          const description =
            typeof data.description === 'function'
              ? await data.description(response)
              : data.description

          this.create({ id, type: 'success', title: successMsg, description })
        }
      })
      .catch(async (error) => {
        result = ['reject', error]

        if (data.error !== undefined) {
          shouldDismiss = false
          const errorMsg =
            typeof data.error === 'function' ? await data.error(error) : data.error
          const description =
            typeof data.description === 'function'
              ? await data.description(error)
              : data.description

          this.create({ id, type: 'error', title: errorMsg, description })
        }
      })
      .finally(() => {
        if (shouldDismiss) {
          // toast is still in load state, dismiss it
          this.dismiss(id)
          id = undefined
        }
        data.finally?.()
      })

    // return a promise that can be unwrapped
    const unwrap = () =>
      new Promise<ToastData>((resolve, reject) =>
        originalPromise
          .then(() => (result[0] === 'reject' ? reject(result[1]) : resolve(result[1])))
          .catch(reject)
      )

    if (typeof id !== 'string' && typeof id !== 'number') {
      return { unwrap }
    } else {
      return Object.assign(id, { unwrap })
    }
  }

  /**
   * Show a custom JSX toast
   */
  custom = (jsx: (id: string | number) => React.ReactElement, data?: ExternalToast) => {
    const id = data?.id ?? toastsCounter++
    this.create({ jsx: jsx(id), ...data, id })
    return id
  }

  /**
   * Get all active (non-dismissed) toasts
   */
  getActiveToasts = () => {
    return this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id))
  }

  /**
   * Get full toast history
   */
  getHistory = () => {
    return this.toasts
  }
}

function isHttpResponse(data: any): data is Response {
  return (
    data &&
    typeof data === 'object' &&
    'ok' in data &&
    typeof data.ok === 'boolean' &&
    'status' in data &&
    typeof data.status === 'number'
  )
}

// singleton instance
export const ToastState = new Observer()

// basic toast function
const toastFunction = (title: TitleT, data?: ExternalToast) => {
  return ToastState.create({ ...data, title })
}

// getters
const getHistory = () => ToastState.getHistory()
const getToasts = () => ToastState.getActiveToasts()

/**
 * Main toast API - call directly or use methods like toast.success()
 *
 * @example
 * // basic usage
 * toast('Hello world')
 *
 * // with type
 * toast.success('Saved!')
 * toast.error('Something went wrong')
 *
 * // with options
 * toast('Hello', { duration: 5000 })
 *
 * // promise toast
 * toast.promise(fetch('/api'), {
 *   loading: 'Loading...',
 *   success: 'Done!',
 *   error: 'Failed'
 * })
 *
 * // custom JSX
 * toast.custom((id) => <MyToast id={id} />)
 *
 * // dismiss
 * const id = toast('Hello')
 * toast.dismiss(id)
 * toast.dismiss() // dismiss all
 */
export const toast = Object.assign(toastFunction, {
  success: ToastState.success,
  error: ToastState.error,
  warning: ToastState.warning,
  info: ToastState.info,
  loading: ToastState.loading,
  promise: ToastState.promise,
  custom: ToastState.custom,
  dismiss: ToastState.dismiss,
  message: ToastState.message,
  getHistory,
  getToasts,
})

export type { NativeToastRef }
