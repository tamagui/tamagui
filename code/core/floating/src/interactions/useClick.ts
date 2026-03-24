import { useMemo, useRef } from 'react'
import { isHTMLElement, isMouseLikePointerType, isTypeableElement } from './utils'
import type { ElementProps, FloatingInteractionContext, UseClickProps } from './types'

function isButtonTarget(event: React.KeyboardEvent<Element>) {
  return isHTMLElement(event.target) && event.target.tagName === 'BUTTON'
}

function isAnchorTarget(event: React.KeyboardEvent<Element>) {
  return isHTMLElement(event.target) && event.target.tagName === 'A'
}

function isSpaceIgnored(element: Element | null) {
  return isTypeableElement(element)
}

// click interaction: toggles open state on click/mousedown
export function useClick(
  context: FloatingInteractionContext,
  props: UseClickProps = {}
): ElementProps {
  const {
    open,
    onOpenChange,
    dataRef,
    elements: { domReference },
  } = context
  const {
    enabled = true,
    event: eventOption = 'click',
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true,
    stickIfOpen = true,
  } = props

  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch' | undefined>(undefined)
  const didKeyDownRef = useRef(false)

  const reference: ElementProps['reference'] = useMemo(
    () => ({
      onPointerDown(event: any) {
        pointerTypeRef.current = event.pointerType
      },
      onMouseDown(event: any) {
        const pointerType = pointerTypeRef.current

        // ignore all buttons except for the "main" button
        if (event.button !== 0) return
        if (eventOption === 'click') return
        if (isMouseLikePointerType(pointerType, true) && ignoreMouse) return

        if (
          open &&
          toggle &&
          (dataRef.current.openEvent && stickIfOpen
            ? dataRef.current.openEvent.type === 'mousedown'
            : true)
        ) {
          onOpenChange(false, event.nativeEvent || event, 'click')
        } else {
          // prevent stealing focus from the floating element
          event.preventDefault()
          onOpenChange(true, event.nativeEvent || event, 'click')
        }
      },
      onClick(event: any) {
        const pointerType = pointerTypeRef.current

        if (eventOption === 'mousedown' && pointerTypeRef.current) {
          pointerTypeRef.current = undefined
          return
        }

        if (isMouseLikePointerType(pointerType, true) && ignoreMouse) return

        if (
          open &&
          toggle &&
          (dataRef.current.openEvent && stickIfOpen
            ? dataRef.current.openEvent.type === 'click'
            : true)
        ) {
          onOpenChange(false, event.nativeEvent || event, 'click')
        } else {
          onOpenChange(true, event.nativeEvent || event, 'click')
        }
      },
      onKeyDown(event: any) {
        pointerTypeRef.current = undefined

        if (event.defaultPrevented || !keyboardHandlers || isButtonTarget(event)) {
          return
        }

        if (event.key === ' ' && !isSpaceIgnored(domReference)) {
          // prevent scrolling
          event.preventDefault()
          didKeyDownRef.current = true
        }

        if (isAnchorTarget(event)) {
          return
        }

        if (event.key === 'Enter') {
          if (open && toggle) {
            onOpenChange(false, event.nativeEvent || event, 'click')
          } else {
            onOpenChange(true, event.nativeEvent || event, 'click')
          }
        }
      },
      onKeyUp(event: any) {
        if (
          event.defaultPrevented ||
          !keyboardHandlers ||
          isButtonTarget(event) ||
          isSpaceIgnored(domReference)
        ) {
          return
        }

        if (event.key === ' ' && didKeyDownRef.current) {
          didKeyDownRef.current = false
          if (open && toggle) {
            onOpenChange(false, event.nativeEvent || event, 'click')
          } else {
            onOpenChange(true, event.nativeEvent || event, 'click')
          }
        }
      },
    }),
    [
      dataRef,
      domReference,
      eventOption,
      ignoreMouse,
      keyboardHandlers,
      onOpenChange,
      open,
      stickIfOpen,
      toggle,
    ]
  )

  return useMemo(() => (enabled ? { reference } : {}), [enabled, reference])
}
