/**
 * Native toast list hook — returns shared values and a flat render function.
 * No extra component layers — the render function is called directly in ToastList.
 */

import * as React from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { NativeToastItem } from './NativeToastItem'
import type { ToastT } from './ToastState'

interface NativeRenderOptions {
  toasts: ToastT[]
  expanded: boolean
  position: string
  visibleToasts: number
  gap: number
  duration: number
  reducedMotion?: boolean
  removeToast: (toast: ToastT) => void
  triggerDismissCooldown: () => void
  onTap?: () => void
  renderContent?: (toast: ToastT, index: number, handleClose?: () => void) => React.ReactNode
}

export function useNativeToastList() {
  const heightsSV = useSharedValue<Record<string, number>>({})
  const totalSV = useSharedValue(0)
  const toastOrderSV = useSharedValue<string[]>([])
  const prevCountRef = React.useRef(0)
  const knownIdsRef = React.useRef<Set<string>>(new Set())
  const timeoutRefs = React.useRef<Map<string | number, NodeJS.Timeout>>(new Map())
  const hideImplRef = React.useRef<((id: string) => void) | null>(null)

  // returns a flat render function — NOT a component.
  // this avoids extra component layers in the tree.
  const renderNativeToasts = React.useCallback(
    (options: NativeRenderOptions): React.ReactNode => {
      const {
        toasts,
        expanded,
        position,
        visibleToasts,
        gap,
        duration,
        reducedMotion,
        removeToast,
        triggerDismissCooldown,
        onTap,
        renderContent,
      } = options

      const [yPosition] = position.split('-') as ['top' | 'bottom', string]

      // sync total and toast order
      if (toasts.length !== prevCountRef.current) {
        totalSV.set(toasts.length)
        toastOrderSV.set(toasts.map((t) => String(t.id)))
        prevCountRef.current = toasts.length
      }

      // hide function for gestures
      const hide = (id: string) => {
        const toast = toasts.find((t) => String(t.id) === String(id))
        if (toast) {
          triggerDismissCooldown()
          toast.onDismiss?.(toast)
        }
        // remove toast from array immediately — Reanimated's exiting animation
        // handles the visual exit. Height is removed after exit animation completes
        // (150ms Keyframe + buffer) so remaining toasts animate smoothly to new positions.
        removeToast(toast || ({ id } as any))
        totalSV.set((v) => v - 1)
        setTimeout(() => {
          heightsSV.modify((v: any) => {
            'worklet'
            const result = { ...v }
            delete result[id]
            return result
          })
        }, 250)
        // clear timer
        const timeout = timeoutRefs.current.get(id)
        if (timeout) {
          clearTimeout(timeout)
          timeoutRefs.current.delete(id)
        }
      }
      hideImplRef.current = hide

      // setup timers for toasts that don't have one — keep running even when expanded
      for (const toast of toasts) {
        if (timeoutRefs.current.has(toast.id)) continue
        if (toast.type === 'loading') continue
        const d = toast.duration ?? duration
        if (d === Infinity || d === Number.POSITIVE_INFINITY) continue
        const timeout = setTimeout(() => {
          hideImplRef.current?.(String(toast.id))
          timeoutRefs.current.delete(toast.id)
        }, d)
        timeoutRefs.current.set(toast.id, timeout)
      }

      // cleanup timers for removed toasts
      const currentIds = new Set(toasts.map((t) => t.id))
      timeoutRefs.current.forEach((timeout, id) => {
        if (!currentIds.has(id)) {
          clearTimeout(timeout)
          timeoutRefs.current.delete(id)
        }
      })

      // determine which toasts are newly created (not just revealed by dismissing another)
      const newIds = new Set<string>()
      for (const toast of toasts) {
        const id = String(toast.id)
        if (!knownIdsRef.current.has(id)) {
          newIds.add(id)
          knownIdsRef.current.add(id)
        }
      }
      // cleanup known IDs for removed toasts
      const currentIds2 = new Set(toasts.map((t) => String(t.id)))
      knownIdsRef.current.forEach((id) => {
        if (!currentIds2.has(id)) knownIdsRef.current.delete(id)
      })

      // expanded: render all toasts (height-based stacking positions them)
      // collapsed: cap at visibleToasts + 1 (extra buffer for fading last toast)
      const maxRender = expanded
        ? toasts.length
        : Math.min(toasts.length, visibleToasts + 1)

      return toasts.slice(0, maxRender).map((toast, index) => {
        const handleClose = () => hide(String(toast.id))
        return (
          <NativeToastItem
            key={toast.id}
            toast={toast}
            index={index}
            expanded={expanded}
            gap={gap}
            isNew={newIds.has(String(toast.id))}
            total={totalSV}
            heights={heightsSV}
            toastOrder={toastOrderSV}
            hide={hide}
            onTap={onTap}
            placement={yPosition}
            maxVisibleToasts={visibleToasts}
            reducedMotion={reducedMotion}
          >
            {renderContent?.(toast, index, handleClose)}
          </NativeToastItem>
        )
      })
    },
    [heightsSV, totalSV]
  )

  return renderNativeToasts
}
