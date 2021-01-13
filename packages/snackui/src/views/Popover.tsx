import { fullyIdle, series } from '@dish/async'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Transition, useLayer } from 'react-laag'
import { Platform } from 'react-native'

import { useOverlay } from '../hooks/useOverlay'
import { AnimatedVStack } from './AnimatedStack'
import { Modal } from './Modal'
import { PopoverProps } from './PopoverProps'
import { popoverCloseCbs } from './PopoverShared'

export function Popover(props: PopoverProps) {
  const isOpen = props.isOpen ?? false
  const onChangeOpenCb = useCallback(props.onChangeOpen as any, [
    props.onChangeOpen,
  ])
  const closeCb = useRef<Function | null>(null)
  const isControlled = typeof isOpen !== 'undefined'
  const [isMounted, setIsMounted] = useState(props.mountImmediately ?? false)

  useEffect(() => {
    if (isMounted) {
      return
    }
    return series([fullyIdle, () => setIsMounted(true)])
  }, [])

  useLayoutEffect(() => {
    if (onChangeOpenCb) {
      popoverCloseCbs.add(onChangeOpenCb)
      return () => {
        popoverCloseCbs.delete(onChangeOpenCb!)
      }
    }
  }, [onChangeOpenCb])

  if (Platform.OS == 'web') {
    useOverlay({
      isOpen: !!(isOpen && props.overlay !== false),
      onClick: () => {
        if (!isControlled) {
          closeCb.current?.()
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
      return null
    }

    return (
      <>
        <div
          {...triggerProps}
          className={`see-through-measurable ${
            props.inline ? 'inline-flex' : ''
          }`}
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
                {typeof props.contents === 'function'
                  ? props.contents(isOpen)
                  : props.contents}
                {/* {!props.noArrow && (
                        <Arrow
                          style={{
                            position: 'absolute',
                            transformOrigin: 'center',
                            transform: getArrowTranslate(props.position),
                            ...arrowStyle,
                          }}
                        />
                      )} */}
              </AnimatedVStack>
            </div>
          )}
      </>
    )
  }

  if (!isMounted) {
    return props.children
  }

  if (props.isOpen) {
    return (
      <>
        {props.children}
        <Modal transparent={false} presentationStyle="formSheet" visible>
          {props.contents}
        </Modal>
      </>
    )
  }

  // native: todo
  return props.children
}

// function getArrowTranslate(position) {
//   let x = '-50%'
//   let y = '0px'
//   const OFFSET = 3.5
//   if (position === 'left') {
//     x = -OFFSET + 'px'
//     y = '-50%'
//   } else if (position === 'right') {
//     x = OFFSET + 'px'
//     y = '-50%'
//   }
//   const rotation = {
//     top: 180,
//     right: -90,
//     left: 90,
//     bottom: 0,
//   }
//   return `translate(${x}, ${y}) rotate(${rotation[position]}deg)`
// }

// const Arrow = (props: any) => (
//   <svg width={14} height={7} {...props}>
//     <g fill="none" fillRule="evenodd">
//       <path
//         fill="#CDCFD0"
//         d="M7 .07v1.428l-5.55 5.5L0 6.982zM7 .07v1.428l5.55 5.5L14 6.982z"
//       />
//       <path fill="#FFF" d="M1.45 7L7 1.498 12.55 7z" />
//     </g>
//   </svg>
// )
