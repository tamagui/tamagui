import * as React from 'react'
import type { HeightT, ToasterPosition } from './Toaster'
import type { ToastT, ToastToDismiss } from './ToastState'
import { ToastState } from './ToastState'

export interface UseToastsOptions {
  /**
   * Maximum number of toasts to keep in state
   * @default 10
   */
  limit?: number
}

export interface UseToastsReturn {
  /** Current list of toasts */
  toasts: ToastT[]
  /** Heights of each toast for stacking calculations */
  heights: HeightT[]
  /** Set heights (used by ToastItem) */
  setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>
  /** Whether toasts are expanded (hover state) */
  expanded: boolean
  /** Set expanded state */
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  /** Remove a toast from the list */
  removeToast: (toast: ToastT) => void
}

/**
 * Hook to subscribe to toast state and manage toast list.
 * Use this for building custom toast UIs with full control.
 *
 * @example
 * ```tsx
 * function MyToaster() {
 *   const { toasts, heights, setHeights, expanded, setExpanded, removeToast } = useToasts()
 *
 *   return (
 *     <ToastViewport onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
 *       {toasts.map((toast, index) => (
 *         <ToastItem
 *           key={toast.id}
 *           toast={toast}
 *           index={index}
 *           expanded={expanded}
 *           removeToast={removeToast}
 *           heights={heights}
 *           setHeights={setHeights}
 *           // ... other props
 *         />
 *       ))}
 *     </ToastViewport>
 *   )
 * }
 * ```
 */
export function useToasts(options: UseToastsOptions = {}): UseToastsReturn {
  const { limit = 10 } = options

  const [toasts, setToasts] = React.useState<ToastT[]>([])
  const [heights, setHeights] = React.useState<HeightT[]>([])
  const [expanded, setExpanded] = React.useState(false)

  // subscribe to toast state changes
  React.useEffect(() => {
    return ToastState.subscribe((toast) => {
      if ((toast as ToastToDismiss).dismiss) {
        // mark toast for deletion animation
        setToasts((toasts) =>
          toasts.map((t) => (t.id === toast.id ? { ...t, delete: true } : t))
        )
        return
      }

      // add or update toast
      setToasts((toasts) => {
        const indexOfExistingToast = toasts.findIndex((t) => t.id === toast.id)

        if (indexOfExistingToast !== -1) {
          // update existing
          return [
            ...toasts.slice(0, indexOfExistingToast),
            { ...toasts[indexOfExistingToast], ...toast },
            ...toasts.slice(indexOfExistingToast + 1),
          ]
        }

        // add new toast at the beginning, respect limit
        const newToasts = [toast as ToastT, ...toasts]
        return newToasts.slice(0, limit)
      })
    })
  }, [limit])

  // collapse expanded view when only 1 toast remains
  React.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false)
    }
  }, [toasts.length])

  const removeToast = React.useCallback((toastToRemove: ToastT) => {
    setToasts((toasts) => {
      if (!toasts.find((toast) => toast.id === toastToRemove.id)?.delete) {
        ToastState.dismiss(toastToRemove.id)
      }
      return toasts.filter(({ id }) => id !== toastToRemove.id)
    })
  }, [])

  return {
    toasts,
    heights,
    setHeights,
    expanded,
    setExpanded,
    removeToast,
  }
}
