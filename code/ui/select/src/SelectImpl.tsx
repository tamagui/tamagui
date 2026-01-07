import type { SideObject } from '@floating-ui/react'
import {
  autoUpdate,
  flip,
  inner,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react'
import { isClient, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useEvent, useIsTouchDevice } from '@tamagui/core'
import * as React from 'react'
import { flushSync } from 'react-dom'
import { SCROLL_ARROW_THRESHOLD, WINDOW_PADDING } from './constants'
import {
  SelectItemParentProvider,
  SelectProvider,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type { SelectImplProps } from './types'

// TODO use id for focusing from label
export const SelectInlineImpl = (props: SelectImplProps) => {
  const { scope, children, open = false, listContentRef } = props

  const selectContext = useSelectContext(scope)
  const selectItemParentContext = useSelectItemParentContext(scope)
  const { setActiveIndex, selectedIndex, activeIndex, dir } = selectContext

  const { setOpen, setSelectedIndex } = selectItemParentContext

  const [scrollTop, setScrollTop] = React.useState(0)
  const touch = useIsTouchDevice()

  const listItemsRef = React.useRef<Array<HTMLElement | null>>([])
  const overflowRef = React.useRef<null | SideObject>(null)
  const upArrowRef = React.useRef<HTMLDivElement | null>(null)
  const downArrowRef = React.useRef<HTMLDivElement | null>(null)
  const allowSelectRef = React.useRef(false)
  const allowMouseUpRef = React.useRef(true)
  const selectTimeoutRef = React.useRef<any>(null)
  const state = React.useRef({
    isMouseOutside: false,
    isTyping: false,
  })

  const [controlledScrolling, setControlledScrolling] = React.useState(false)
  const [fallback, setFallback] = React.useState(false)
  const [innerOffset, setInnerOffset] = React.useState(0)
  const [blockSelection, setBlockSelection] = React.useState(false)
  const floatingStyle = React.useRef({})

  // Track DOM direction changes for RTL support
  // This handles dynamic changes to document.documentElement.dir
  const [domDirection, setDomDirection] = React.useState<string>(() =>
    isClient ? document.documentElement.dir || 'ltr' : 'ltr'
  )

  if (isWeb && isClient) {
    useIsomorphicLayoutEffect(() => {
      // Check direction on mount and when opening
      const checkDirection = () => {
        const currentDir = document.documentElement.dir || 'ltr'
        setDomDirection(currentDir)
      }
      checkDirection()

      // Observe changes to the html element's dir attribute
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'dir') {
            checkDirection()
          }
        }
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['dir'],
      })

      return () => observer.disconnect()
    }, [])
  }

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  useIsomorphicLayoutEffect(() => {
    queueMicrotask(() => {
      if (!open) {
        setScrollTop(0)
        setFallback(false)
        setActiveIndex(null)
        setControlledScrolling(false)
      }
    })
  }, [open, setActiveIndex])

  // close when mouseup outside select
  if (isWeb && isClient) {
    useIsomorphicLayoutEffect(() => {
      if (!open) return
      const mouseUp = (e: MouseEvent) => {
        if (state.current.isMouseOutside) {
          setOpen(false)
        }
      }
      document.addEventListener('mouseup', mouseUp)
      return () => {
        document.removeEventListener('mouseup', mouseUp)
      }
    }, [open])
  }

  const { x, y, strategy, context, refs, update, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    middleware: false
      ? // this is the logic from floating-ui
        // but i find it causes issues (open, drag select, close, then re-open its not positioned "over")
        // https://github.com/floating-ui/floating-ui/blob/master/packages/react/test/visual/components/MacSelect.tsx
        [
          offset(5),
          touch
            ? shift({ crossAxis: true, padding: WINDOW_PADDING })
            : flip({ padding: WINDOW_PADDING }),
          size({
            apply({ availableHeight, rects }) {
              Object.assign(floatingStyle.current, {
                maxHeight: `${availableHeight}px`,
                minWidth: `${rects.reference.width}px`,
              })
              if (refs.floating.current) {
                Object.assign(refs.floating.current.style, floatingStyle.current)
              }
            },
            padding: 10,
          }),
        ]
      : [
          size({
            apply({
              rects: {
                reference: { width },
              },
            }) {
              Object.assign(floatingStyle.current, {
                minWidth: width + 8,
              })
              if (refs.floating.current) {
                Object.assign(refs.floating.current.style, floatingStyle.current)
              }
            },
          }),
          inner({
            listRef: listItemsRef,
            overflowRef,
            index: selectedIndex,
            offset: innerOffset,
            onFallbackChange: setFallback,
            padding: 10,
            minItemsVisible: touch ? 10 : 4,
            referenceOverflowThreshold: 20,
          }),
          offset({ crossAxis: -5 }),
        ],
  })

  const floatingRef = refs.floating

  const showUpArrow = open && scrollTop > SCROLL_ARROW_THRESHOLD
  const showDownArrow =
    open &&
    floatingRef.current &&
    scrollTop <
      floatingRef.current.scrollHeight -
        floatingRef.current.clientHeight -
        SCROLL_ARROW_THRESHOLD

  const isScrollable = showDownArrow || showUpArrow

  // Use the effective direction - prefer explicit prop over DOM direction
  const effectiveDir = dir || domDirection
  const isRTL = effectiveDir === 'rtl'

  // State to hold RTL-adjusted x coordinate
  const [rtlAdjustedX, setRtlAdjustedX] = React.useState<number | null>(null)

  // Apply RTL adjustment after the floating element is rendered
  // floating-ui doesn't correctly adjust x coordinate for RTL alignment
  useIsomorphicLayoutEffect(() => {
    if (!isRTL || !open || !refs.reference.current || !refs.floating.current) {
      setRtlAdjustedX(null)
      return
    }

    // Wait a frame for the floating element to be fully rendered
    const rafId = requestAnimationFrame(() => {
      if (!refs.reference.current || !refs.floating.current) return

      const refRect = refs.reference.current.getBoundingClientRect()
      const floatingRect = refs.floating.current.getBoundingClientRect()

      // In RTL with bottom-start placement, align right edges
      const correctX = refRect.right - floatingRect.width

      // Only adjust if significantly different from current position
      if (Math.abs(correctX - floatingRect.x) > 10) {
        setRtlAdjustedX(correctX)
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [isRTL, open, x, y])

  // Create adjusted floating styles for RTL support
  const adjustedFloatingStyles = React.useMemo(() => {
    if (rtlAdjustedX !== null) {
      return {
        ...floatingStyles,
        transform: `translate(${rtlAdjustedX}px, ${y ?? 0}px)`,
      }
    }
    return floatingStyles
  }, [floatingStyles, rtlAdjustedX, y])

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', update)
    if (open) {
      update()
    }
    return () => window.removeEventListener('resize', update)
  }, [update, open, effectiveDir])

  const onMatch = useEvent((index: number) => {
    const fn = open ? setActiveIndex : setSelectedIndex
    return fn(index)
  })

  const interactionsProps = [
    useClick(context, { event: 'mousedown', keyboardHandlers: false }),
    useDismiss(context, { outsidePress: false }),
    useRole(context, { role: 'listbox' }),
    useInnerOffset(context, {
      enabled: !fallback && isScrollable,
      onChange: setInnerOffset,
      overflowRef,
      scrollRef: refs.floating,
    }),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex: activeIndex || 0,
      selectedIndex,
      onNavigate: setActiveIndex,
      scrollItemIntoView: false,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch,
      selectedIndex,
      activeIndex,
      onTypingChange: (e) => {
        state.current.isTyping = e
      },
    }),
  ]

  const interactions = useInteractions(
    // unfortunately these memos will just always break due to floating-ui context always changing :/
    React.useMemo(() => {
      return interactionsProps
    }, interactionsProps)
  )

  const interactionsContext = React.useMemo(() => {
    return {
      ...interactions,
      getReferenceProps() {
        return interactions.getReferenceProps({
          ref: refs.reference as any,
          className: 'SelectTrigger',
          onKeyDown(event) {
            if (
              event.key === 'Enter' ||
              event.code === 'Space' ||
              (event.key === ' ' && !state.current.isTyping)
            ) {
              event.preventDefault()
              setOpen(true)
            }
          },
        })
      },
      getFloatingProps(props) {
        return interactions.getFloatingProps({
          ref: refs.floating,
          className: 'Select',
          ...props,
          style: {
            // Use adjusted floating styles for proper RTL support
            ...adjustedFloatingStyles,
            // Fix for RTL positioning: unset inset to prevent browser RTL interference
            // See: https://github.com/floating-ui/floating-ui/issues/3221
            inset: 'unset',
            outline: 0,
            scrollbarWidth: 'none',
            ...floatingStyle.current,
            ...props?.style,
          },
          onPointerEnter() {
            setControlledScrolling(false)
            state.current.isMouseOutside = false
          },
          onPointerLeave() {
            state.current.isMouseOutside = true
          },
          onPointerMove() {
            state.current.isMouseOutside = false
            setControlledScrolling(false)
          },
          onKeyDown() {
            setControlledScrolling(true)
          },
          onContextMenu(e) {
            e.preventDefault()
          },
          onScroll(event) {
            flushSync(() => {
              setScrollTop(event.currentTarget.scrollTop)
            })
          },
        })
      },
    }
  }, [refs.reference.current, adjustedFloatingStyles, refs.floating.current, interactions])

  // effects

  useIsomorphicLayoutEffect(() => {
    if (open) {
      selectTimeoutRef.current = setTimeout(() => {
        allowSelectRef.current = true
      }, 300)

      return () => {
        clearTimeout(selectTimeoutRef.current)
      }
    }
    allowSelectRef.current = false
    allowMouseUpRef.current = true
    setInnerOffset(0)
    setFallback(false)
    setBlockSelection(false)
  }, [open])

  useIsomorphicLayoutEffect(() => {
    if (!open && state.current.isMouseOutside) {
      state.current.isMouseOutside = false
    }
  }, [open])

  // Replacement for `useDismiss` as the arrows are outside of the floating
  // element DOM tree.
  useIsomorphicLayoutEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        !(
          refs.floating.current?.contains(target) ||
          upArrowRef.current?.contains(target) ||
          downArrowRef.current?.contains(target)
        )
      ) {
        setOpen(false)
        setControlledScrolling(false)
      }
    }

    if (open) {
      document.addEventListener('pointerdown', onPointerDown)
      return () => {
        document.removeEventListener('pointerdown', onPointerDown)
      }
    }
  }, [open, refs, setOpen])

  // Scroll the `activeIndex` item into view only in "controlledScrolling"
  // (keyboard nav) mode.
  React.useEffect(() => {
    if (open && controlledScrolling) {
      if (activeIndex != null) {
        listItemsRef.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }

    setScrollTop(refs.floating.current?.scrollTop ?? 0)
  }, [open, refs, controlledScrolling, activeIndex])

  // Scroll the `selectedIndex` into view upon opening the floating element.
  React.useEffect(() => {
    if (open && fallback) {
      if (selectedIndex != null) {
        listItemsRef.current[selectedIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [open, fallback, selectedIndex])

  // Unset the height limiting for fallback mode. This gets executed prior to
  // the positioning call.
  useIsomorphicLayoutEffect(() => {
    if (refs.floating.current && fallback) {
      refs.floating.current.style.maxHeight = ''
    }
  }, [refs, fallback])

  // We set this to true by default so that events bubble to forms without JS (SSR)
  // const isFormControl = trigger ? Boolean(trigger.closest('form')) : true
  // const [bubbleSelect, setBubbleSelect] = React.useState<HTMLSelectElement | null>(null)
  // const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null)

  return (
    <SelectProvider
      scope={scope}
      {...(selectContext as Required<typeof selectContext>)}
      setScrollTop={setScrollTop}
      setInnerOffset={setInnerOffset}
      fallback={fallback}
      floatingContext={context}
      activeIndex={activeIndex}
      canScrollDown={!!showDownArrow}
      canScrollUp={!!showUpArrow}
      controlledScrolling={controlledScrolling}
      blockSelection={blockSelection}
      upArrowRef={upArrowRef}
      downArrowRef={downArrowRef}
      update={update}
    >
      <SelectItemParentProvider
        scope={scope}
        {...selectItemParentContext}
        allowMouseUpRef={allowMouseUpRef}
        allowSelectRef={allowSelectRef}
        dataRef={context.dataRef}
        interactions={interactionsContext}
        listRef={listItemsRef}
        selectTimeoutRef={selectTimeoutRef}
      >
        {children}
      </SelectItemParentProvider>
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
