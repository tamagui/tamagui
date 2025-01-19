// via radix-ui

import * as React from 'react'

export function usePrevious<T>(value: T): T {
  const ref = React.useRef({ value, previous: value })

  // We compare values before making an update to ensure that
  // a change has been made. This ensures the previous value is
  // persisted correctly between renders.
  return React.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value
      ref.current.value = value
    }
    return ref.current.previous
  }, [value])
}
