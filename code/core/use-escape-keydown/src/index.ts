// via radix-ui
import { useCallbackRef } from '@tamagui/use-callback-ref'
import React from 'react'

/**
 * Listens for when the escape key is down
 */
export function useEscapeKeydown(
  onEscapeKeyDownProp?: (event: KeyboardEvent) => void,
  ownerDocument: Document = globalThis?.document
): void {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event)
      }
    }

    ownerDocument.addEventListener('keydown', handleKeyDown)

    return () => {
      ownerDocument.removeEventListener('keydown', handleKeyDown)
    }
  }, [onEscapeKeyDown, ownerDocument])
}
