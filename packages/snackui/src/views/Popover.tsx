import React from 'react'
import { useLayer } from 'react-laag'
import { useOverlay } from '../hooks/useOverlay'
import { AnimatedVStack } from './AnimatedStack'
import { PopoverProps } from './PopoverProps'
import { usePopover } from './usePopover'


export function Popover(props: PopoverProps) {
  const { isOpen, isControlled, sendClose, onChangeOpenCb, isMounted } = usePopover(props)

  useOverlay({
    isOpen: !!(isOpen && props.overlay !== false),
    onClick: () => {
      if (!isControlled) {
        sendClose()
      }
      onChangeOpenCb?.(false)
    },
    pointerEvents: props.overlayPointerEvents,
  })

  const placement =
    props.anchor ?? props.position === 'top'
      ? 'top-center'
      : props.position == 'left'
      ? 'left-center'
      : props.position === 'right'
      ? 'right-center'
      : 'bottom-center'
  const { layerProps, triggerProps, renderLayer } = useLayer({
    isOpen,
    container: document.body,
    placement,
    auto: true,
    snap: false,
    triggerOffset: 12,
    containerOffset: 16,
    ResizeObserver: window['ResizeObserver'],
  })

  if (!isMounted) {
    return props.children
  }

  return (
    <>
      <div
        {...triggerProps}
        className={`see-through-measurable ${props.inline ? 'inline-flex' : ''}`}
        style={props.style}
      >
        {props.children}
      </div>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            style={{
              ...layerProps.style,
              zIndex: 100000,
              pointerEvents: isOpen ? 'auto' : 'none',
              marginTop: isOpen ? 0 : 10,
              opacity: isOpen ? 1 : 0,
              transition: '0.2s ease-in-out',
            }}
          >
            <AnimatedVStack>
              {typeof props.contents === 'function' ? props.contents(isOpen) : props.contents}
            </AnimatedVStack>
          </div>
        )}
    </>
  )
}
