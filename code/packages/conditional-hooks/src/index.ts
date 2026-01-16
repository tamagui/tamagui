import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'

/**
 * These are aliased React hooks that don't start with "use" prefix.
 * This allows them to be called conditionally without React Compiler
 * bailing out on the entire function.
 *
 * Use these ONLY for platform-specific code paths where the condition
 * is a compile-time constant (like process.env.TAMAGUI_TARGET) that
 * gets tree-shaken in platform-specific builds.
 *
 * Example:
 *   if (process.env.TAMAGUI_TARGET === 'web') {
 *     conditionalEffect(() => { ... }, [])
 *   }
 */

export const conditionalCallback = useCallback
export const conditionalContext = useContext
export const conditionalDebugValue = useDebugValue
export const conditionalDeferredValue = useDeferredValue
export const conditionalEffect = useEffect
export const conditionalId = useId
export const conditionalImperativeHandle = useImperativeHandle
export const conditionalInsertionEffect = useInsertionEffect
export const conditionalLayoutEffect = useIsomorphicLayoutEffect
export const conditionalMemo = useMemo
export const conditionalReducer = useReducer
export const conditionalRef = useRef
export const conditionalState = useState
export const conditionalSyncExternalStore = useSyncExternalStore
export const conditionalTransition = useTransition
