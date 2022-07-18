import {
  detectOverflow,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react-dom-interactions'
import { usePrevious } from '@radix-ui/react-use-previous'
import * as React from 'react'

import { FALLBACK_THRESHOLD, MIN_HEIGHT, SCROLL_ARROW_THRESHOLD, WINDOW_PADDING } from './constants'
import { SelectProvider, useSelectContext } from './context'
import { getVisualOffsetTop, isFirefox } from './Select'
import { ScopedProps, SelectProps } from './types'

export type SelectImplProps = ScopedProps<SelectProps> & {
  activeIndexRef: any
  selectedIndexRef: any
  listContentRef: any
}

// TODO use id for focusing from label
export const SelectInlineImpl = (props: SelectImplProps) => {
  const {
    __scopeSelect,
    children,
    open = false,
    activeIndexRef,
    selectedIndexRef,
    listContentRef,
  } = props

  const selectContext = useSelectContext('SelectSheetImpl', __scopeSelect)
  const { setActiveIndex, setOpen, setSelectedIndex, selectedIndex, activeIndex, forceUpdate } =
    selectContext
  const [showArrows, setShowArrows] = React.useState(false)
  const [scrollTop, setScrollTop] = React.useState(0)
  const prevActiveIndex = usePrevious<number | null>(activeIndex)

  const listItemsRef = React.useRef<Array<HTMLElement | null>>([])

  const [controlledScrolling, setControlledScrolling] = React.useState(false)
  const [middlewareType, setMiddlewareType] = React.useState<'align' | 'fallback'>('align')

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowArrows(open)

      if (!open) {
        setScrollTop(0)
        setMiddlewareType('align')
        setActiveIndex(null)
        setControlledScrolling(false)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [open, setActiveIndex])

  function getFloatingPadding(floating: HTMLElement | null) {
    if (!floating) {
      return 0
    }
    return Number(getComputedStyle(floating).paddingLeft?.replace('px', ''))
  }

  const { x, y, reference, floating, strategy, context, refs, middlewareData, update } =
    useFloating({
      open,
      onOpenChange: setOpen,
      placement: 'bottom',
      middleware:
        middlewareType === 'align'
          ? [
              offset(({ rects }) => {
                const index = activeIndexRef.current ?? selectedIndexRef.current

                if (index == null) {
                  return 0
                }

                const item = listItemsRef.current[index]

                if (item == null) {
                  return 0
                }

                const offsetTop = item.offsetTop
                const itemHeight = item.offsetHeight
                const height = rects.reference.height

                return -offsetTop - height - (itemHeight - height) / 2
              }),
              // Custom `size` that can handle the opposite direction of the placement
              {
                name: 'size',
                async fn(args) {
                  const {
                    elements: { floating },
                    rects: { reference },
                    middlewareData,
                  } = args

                  const overflow = await detectOverflow(args, {
                    padding: WINDOW_PADDING,
                  })

                  const top = Math.max(0, overflow.top)
                  const bottom = Math.max(0, overflow.bottom)
                  const nextY = args.y + top

                  if (middlewareData.size?.skip) {
                    return {
                      y: nextY,
                      data: {
                        y: middlewareData.size.y,
                      },
                    }
                  }

                  Object.assign(floating.style, {
                    maxHeight: `${floating.scrollHeight - Math.abs(top + bottom)}px`,
                    minWidth: `${reference.width + getFloatingPadding(floating) * 2}px`,
                  })

                  return {
                    y: nextY,
                    data: {
                      y: top,
                      skip: true,
                    },
                    reset: {
                      rects: true,
                    },
                  }
                },
              },
            ]
          : [
              offset(5),
              flip(),
              size({
                apply({ rects, availableHeight, elements }) {
                  Object.assign(elements.floating.style, {
                    width: `${rects.reference.width}px`,
                    maxHeight: `${availableHeight}px`,
                  })
                },
                padding: WINDOW_PADDING,
              }),
            ],
    })

  const floatingRef = refs.floating

  const showUpArrow = showArrows && scrollTop > SCROLL_ARROW_THRESHOLD
  const showDownArrow =
    showArrows &&
    floatingRef.current &&
    scrollTop <
      floatingRef.current.scrollHeight - floatingRef.current.clientHeight - SCROLL_ARROW_THRESHOLD

  const interactions = useInteractions([
    useClick(context, { pointerDown: true }),
    useRole(context, { role: 'listbox' }),
    useDismiss(context),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : setSelectedIndex,
      selectedIndex,
      activeIndex,
    }),
  ])

  const increaseHeight = React.useCallback(
    (floating: HTMLElement, amount = 0) => {
      if (middlewareType === 'fallback') {
        return
      }

      const currentMaxHeight = Number(floating.style.maxHeight.replace('px', ''))
      const currentTop = Number(floating.style.top.replace('px', ''))
      const rect = floating.getBoundingClientRect()
      const rectTop = rect.top
      const rectBottom = rect.bottom
      const viewportHeight = visualViewport?.height ?? 0
      const visualMaxHeight = viewportHeight - WINDOW_PADDING * 2

      if (
        amount < 0 &&
        selectedIndexRef.current != null &&
        Math.round(rectBottom) < Math.round(viewportHeight + getVisualOffsetTop() - WINDOW_PADDING)
      ) {
        floating.style.maxHeight = `${Math.min(visualMaxHeight, currentMaxHeight - amount)}px`
      }

      if (
        amount > 0 &&
        Math.round(rectTop) > Math.round(WINDOW_PADDING - getVisualOffsetTop()) &&
        floating.scrollHeight > floating.offsetHeight
      ) {
        const nextTop = Math.max(WINDOW_PADDING + getVisualOffsetTop(), currentTop - amount)

        const nextMaxHeight = Math.min(visualMaxHeight, currentMaxHeight + amount)

        Object.assign(floating.style, {
          maxHeight: `${nextMaxHeight}px`,
          top: `${nextTop}px`,
        })

        if (nextTop - WINDOW_PADDING > getVisualOffsetTop()) {
          floating.scrollTop -= nextMaxHeight - currentMaxHeight + getFloatingPadding(floating)
        }

        return currentTop - nextTop
      }
    },
    [middlewareType, selectedIndexRef]
  )

  const touchPageYRef = React.useRef<number | null>(null)

  const handleWheel = React.useCallback(
    (event: WheelEvent | TouchEvent) => {
      const pinching = event.ctrlKey

      const currentTarget = event.currentTarget as HTMLElement

      function isWheelEvent(event: any): event is WheelEvent {
        return typeof event.deltaY === 'number'
      }

      function isTouchEvent(event: any): event is TouchEvent {
        return event.touches != null
      }

      if (
        Math.abs(
          (currentTarget?.offsetHeight ?? 0) - ((visualViewport?.height ?? 0) - WINDOW_PADDING * 2)
        ) > 1 &&
        !pinching
      ) {
        event.preventDefault()
      } else if (isWheelEvent(event) && isFirefox) {
        // Firefox needs this to propagate scrolling
        // during momentum scrolling phase if the
        // height reached its maximum (at boundaries)
        currentTarget.scrollTop += event.deltaY
      }

      if (!pinching) {
        let delta = 5

        if (isTouchEvent(event)) {
          const currentPageY = touchPageYRef.current
          const pageY = event.touches[0]?.pageY

          if (pageY != null) {
            touchPageYRef.current = pageY

            if (currentPageY != null) {
              delta = currentPageY - pageY
            }
          }
        }

        increaseHeight(currentTarget, isWheelEvent(event) ? event.deltaY : delta)
        setScrollTop(currentTarget.scrollTop)
        // Ensure derived data (scroll arrows) is fresh
        forceUpdate()
      }
    },
    [forceUpdate, increaseHeight]
  )

  // Handle `onWheel` event in an effect to remove the `passive` option so we
  // can .preventDefault() it
  React.useEffect(() => {
    function onTouchEnd() {
      touchPageYRef.current = null
    }

    const floating = floatingRef.current
    if (open && floating && middlewareType === 'align') {
      floating.addEventListener('wheel', handleWheel)
      floating.addEventListener('touchmove', handleWheel)
      floating.addEventListener('touchend', onTouchEnd, { passive: true })
      return () => {
        floating.removeEventListener('wheel', handleWheel)
        floating.removeEventListener('touchmove', handleWheel)
        floating.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [open, floatingRef, handleWheel, middlewareType])

  // Ensure the menu remains attached to the reference element when resizing.
  React.useEffect(() => {
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [update])

  // Scroll the active or selected item into view when in `controlledScrolling`
  // mode (i.e. arrow key nav).
  React.useLayoutEffect(() => {
    const floating = floatingRef.current

    if (open && controlledScrolling && floating) {
      const item =
        activeIndex != null
          ? listItemsRef.current[activeIndex]
          : selectedIndex != null
          ? listItemsRef.current[selectedIndex]
          : null

      if (item && prevActiveIndex != null) {
        const itemHeight = listItemsRef.current[prevActiveIndex]?.offsetHeight ?? 0

        const floatingHeight = floating.offsetHeight
        const top = item.offsetTop
        const bottom = top + itemHeight

        if (top < floating.scrollTop + 20) {
          const diff = floating.scrollTop - top + 20
          floating.scrollTop -= diff

          if (activeIndex != selectedIndex && activeIndex != null) {
            increaseHeight(floating, -diff)
          }
        } else if (bottom > floatingHeight + floating.scrollTop - 20) {
          const diff = bottom - floatingHeight - floating.scrollTop + 20

          floating.scrollTop += diff

          if (activeIndex != selectedIndex && activeIndex != null) {
            floating.scrollTop -= increaseHeight(floating, diff) ?? 0
          }
        }
      }
    }
  }, [
    open,
    controlledScrolling,
    prevActiveIndex,
    activeIndex,
    selectedIndex,
    floatingRef,
    increaseHeight,
  ])

  // Sync the height and the scrollTop values and device whether to use fallback
  // positioning.
  React.useLayoutEffect(() => {
    const floating = refs.floating.current
    const reference = refs.reference.current

    if (open && floating && reference && floating.offsetHeight < floating.scrollHeight) {
      const referenceRect = reference.getBoundingClientRect()

      if (middlewareType === 'fallback') {
        const item = listItemsRef.current[selectedIndex]
        if (item) {
          floating.scrollTop = item.offsetTop - floating.clientHeight + referenceRect.height
        }
        return
      }

      floating.scrollTop = middlewareData.size?.y

      const closeToBottom =
        (visualViewport?.height ?? 0) + getVisualOffsetTop() - referenceRect.bottom <
        FALLBACK_THRESHOLD
      const closeToTop = referenceRect.top < FALLBACK_THRESHOLD

      if (floating.offsetHeight < MIN_HEIGHT || closeToTop || closeToBottom) {
        setMiddlewareType('fallback')
      }
    }
  }, [
    open,
    increaseHeight,
    selectedIndex,
    middlewareType,
    refs.floating,
    refs.reference,
    // Always re-run this effect when the position has been computed so the
    // .scrollTop change works with fresh sizing.
    middlewareData,
  ])

  React.useLayoutEffect(() => {
    if (open && selectedIndex != null) {
      requestAnimationFrame(() => {
        listItemsRef.current[selectedIndex]?.focus({ preventScroll: true })
      })
    }
  }, [listItemsRef, selectedIndex, open])

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowArrows(open)

      if (!open) {
        setScrollTop(0)
        setMiddlewareType('align')
        setActiveIndex(null)
        setControlledScrolling(false)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [open, setActiveIndex])

  // We set this to true by default so that events bubble to forms without JS (SSR)
  // const isFormControl = trigger ? Boolean(trigger.closest('form')) : true
  // const [bubbleSelect, setBubbleSelect] = React.useState<HTMLSelectElement | null>(null)
  // const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null)
  return (
    <SelectProvider
      scope={__scopeSelect}
      {...(selectContext as Required<typeof selectContext>)}
      increaseHeight={increaseHeight}
      floatingRef={floatingRef}
      setValueAtIndex={(index, value) => {
        listContentRef.current[index] = value
      }}
      interactions={{
        ...interactions,
        getReferenceProps() {
          return interactions.getReferenceProps({
            ref: reference,
            className: 'SelectTrigger',
            onKeyDown(event) {
              if (event.key === 'Enter' || (event.key === ' ' && !context.dataRef.current.typing)) {
                event.preventDefault()
                setOpen(true)
              }
            },
          })
        },
        getFloatingProps(props) {
          return interactions.getFloatingProps({
            ref: floating,
            className: 'Select',
            ...props,
            style: {
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              outline: 0,
              listStyleType: 'none',
              scrollbarWidth: 'none',
              userSelect: 'none',
              ...props?.style,
            },
            onPointerEnter() {
              setControlledScrolling(false)
            },
            onPointerMove() {
              setControlledScrolling(false)
            },
            onKeyDown() {
              setControlledScrolling(true)
            },
            onScroll(event) {
              setScrollTop(event.currentTarget.scrollTop)
            },
          })
        },
      }}
      floatingContext={context}
      activeIndex={activeIndex}
      canScrollDown={!!showDownArrow}
      canScrollUp={!!showUpArrow}
      controlledScrolling
      dataRef={context.dataRef}
      listRef={listItemsRef}
    >
      {children}
      {/* {isFormControl ? (
            <BubbleSelect
              ref={setBubbleSelect}
              aria-hidden
              tabIndex={-1}
              name={name}
              autoComplete={autoComplete}
              value={value}
              // enable form autofill
              onChange={(event) => setValue(event.target.value)}
            />
          ) : null} */}
    </SelectProvider>
  )
}
