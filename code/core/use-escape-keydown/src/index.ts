// via radix-ui
import { useCallbackRef } from '@tamagui/use-callback-ref'
import React from 'react'

/**
 * Listens for when the escape key is down
 */
export function useEscapeKeydown(
  onEscapeKeyDownProp?: React.KeyboardEventHandler,
  ownerDocument: Document = globalThis?.document
): void {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp)

  React.useEffect(() => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event)
      }
    }

    ownerDocument.addEventListener(
      'keydown',
      // @ts-expect-error
      handleKeyDown
    )

    return () => {
      ownerDocument.removeEventListener(
        'keydown',
        // @ts-expect-error
        handleKeyDown
      )
    }
  }, [onEscapeKeyDown, ownerDocument])
}
