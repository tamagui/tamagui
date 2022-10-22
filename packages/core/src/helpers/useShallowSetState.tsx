import React, { useCallback } from 'react'

export function useShallowSetState<State extends Object>(
  setter: React.Dispatch<React.SetStateAction<State>>
) {
  return useCallback(
    (next: Partial<State>) => {
      setter((prev) => {
        for (const key in next) {
          if (prev[key] !== next[key]) {
            return { ...prev, ...next }
          }
        }
        return prev
      })
    },
    [setter]
  )
}
