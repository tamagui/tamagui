/**
 * Shared toast auto-dismiss timer logic.
 * Used by both web and native ToastItemInner implementations.
 */

import { useCallback, useEffect, useRef } from 'react'
import { useEvent } from '@tamagui/core'
import type { ToastT } from './ToastState'

export interface UseToastTimerOptions {
  toast: ToastT
  duration: number
  toastType: string
  expanded: boolean
  interacting: boolean
  removeToast: (toast: ToastT) => void
}

const TIME_BEFORE_UNMOUNT = 200

export function useToastTimer(options: UseToastTimerOptions) {
  const { toast, duration, toastType, expanded, interacting, removeToast } = options

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerStartRef = useRef(0)
  const lastPauseTimeRef = useRef(0)
  const remainingTimeRef = useRef(duration)

  const startTimer = useCallback(() => {
    if (duration === Number.POSITIVE_INFINITY || toastType === 'loading') return
    closeTimerStartRef.current = Date.now()
    closeTimerRef.current = setTimeout(() => {
      toast.onAutoClose?.(toast)
      removeToast(toast)
    }, remainingTimeRef.current)
  }, [duration, toastType, toast, removeToast])

  const pauseTimer = useEvent(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    if (lastPauseTimeRef.current < closeTimerStartRef.current) {
      const elapsed = Date.now() - closeTimerStartRef.current
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
    }
    lastPauseTimeRef.current = Date.now()
  })

  const resumeTimer = useEvent(() => {
    if (expanded || interacting) return
    remainingTimeRef.current = duration
    startTimer()
  })

  // start/pause timer based on expanded/interacting state
  useEffect(() => {
    if (expanded || interacting) {
      pauseTimer()
    } else {
      startTimer()
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [expanded, interacting, startTimer])

  // reset remaining time when duration changes
  useEffect(() => {
    remainingTimeRef.current = duration
  }, [duration])

  return { startTimer, pauseTimer, resumeTimer }
}
