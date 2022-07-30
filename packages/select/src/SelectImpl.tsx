import {
  SideObject,
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
} from '@floating-ui/react-dom-interactions'
import { useIsTouchDevice, useIsomorphicLayoutEffect } from '@tamagui/core'
import * as React from 'react'
import { flushSync } from 'react-dom'

import { SCROLL_ARROW_THRESHOLD, WINDOW_PADDING } from './constants'
import { SelectProvider, useSelectContext } from './context'
import { ScopedProps, SelectProps } from './types'

export type SelectImplProps = ScopedProps<SelectProps> & {
  activeIndexRef: any
  selectedIndexRef: any
  listContentRef: any
}

// TODO use id for focusing from label
export const SelectInlineImpl = (props: SelectImplProps) => {
  const { __scopeSelect, children, open = false, selectedIndexRef, listContentRef } = props

  const selectContext = useSelectContext('SelectSheetImpl', __scopeSelect)
  const { setActiveIndex, setOpen, setSelectedIndex, selectedIndex, activeIndex, forceUpdate } =
    selectContext
  const [scrollTop, setScrollTop] = React.useState(0)
  const touch = useIsTouchDevice()

  const listItemsRef = React.useRef<Array<HTMLElement | null>>([])
  const overflowRef = React.useRef<null | SideObject>(null)
  const upArrowRef = React.useRef<HTMLDivElement | null>(null)
  const downArrowRef = React.useRef<HTMLDivElement | null>(null)
  const allowSelectRef = React.useRef(false)
  const allowMouseUpRef = React.useRef(true)
  const selectTimeoutRef = React.useRef<any>()
  const state = React.useRef({
    isMouseOutside: false,
  })

  const [controlledScrolling, setControlledScrolling] = React.useState(false)
  const [fallback, setFallback] = React.useState(false)
  const [innerOffset, setInnerOffset] = React.useState(0)
  const [blockSelection, setBlockSelection] = React.useState(false)
  const floatingStyle = React.useRef({})

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!open) {
        setScrollTop(0)
        setFallback(false)
        setActiveIndex(null)
        setControlledScrolling(false)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [open, setActiveIndex])

  // close when mouseup outside select
  React.useEffect(() => {
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

  const updateFloatingSize = size({
    apply({
      availableHeight,
      rects: {
        reference: { width },
      },
    }) {
      floatingStyle.current = {
        width: width,
        maxHeight: availableHeight,
      }
    },
    padding: WINDOW_PADDING,
  })

  const { x, y, reference, floating, strategy, context, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    middleware: fallback
      ? [
          offset(5),
          ...[
            touch
              ? shift({ crossAxis: true, padding: WINDOW_PADDING })
              : flip({ padding: WINDOW_PADDING }),
          ],
          updateFloatingSize,
        ]
      : [
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
          updateFloatingSize,
        ],
  })

  const floatingRef = refs.floating

  const showUpArrow = open && scrollTop > SCROLL_ARROW_THRESHOLD
  const showDownArrow =
    open &&
    floatingRef.current &&
    scrollTop <
      floatingRef.current.scrollHeight - floatingRef.current.clientHeight - SCROLL_ARROW_THRESHOLD

  const interactions = useInteractions([
    useClick(context, { pointerDown: true }),
    useDismiss(context, { outsidePointerDown: false }),
    useRole(context, { role: 'listbox' }),
    useInnerOffset(context, {
      enabled: !fallback,
      onChange: setInnerOffset,
      overflowRef,
    }),
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

  const interactionsContext = {
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
          setControlledScrolling(false)
        },
        onKeyDown() {
          setControlledScrolling(true)
        },
        onContextMenu(e) {
          e.preventDefault()
        },
        onScroll(event) {
          // In React 18, the ScrollArrows need to synchronously know this value to prevent
          // painting at the wrong time.
          flushSync(() => setScrollTop(event.currentTarget.scrollTop))
        },
      })
    },
  }

  // effects

  useIsomorphicLayoutEffect(() => {
    if (open) {
      selectTimeoutRef.current = setTimeout(() => {
        allowSelectRef.current = true
      }, 300)

      return () => {
        clearTimeout(selectTimeoutRef.current)
      }
    } else {
      allowSelectRef.current = false
      allowMouseUpRef.current = true
      setInnerOffset(0)
      setFallback(false)
      setBlockSelection(false)
    }
  }, [open])

  // Replacement for `useDismiss` as the arrows are outside of the floating
  // element DOM tree.
  useIsomorphicLayoutEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        !refs.floating.current?.contains(target) &&
        !upArrowRef.current?.contains(target) &&
        !downArrowRef.current?.contains(target)
      ) {
        setOpen(false)
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
  useIsomorphicLayoutEffect(() => {
    if (open && controlledScrolling) {
      if (activeIndex != null) {
        listItemsRef.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }

    setScrollTop(refs.floating.current?.scrollTop ?? 0)
  }, [open, refs, controlledScrolling, activeIndex])

  // Scroll the `selectedIndex` into view upon opening the floating element.
  useIsomorphicLayoutEffect(() => {
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
      scope={__scopeSelect}
      {...(selectContext as Required<typeof selectContext>)}
      setScrollTop={setScrollTop}
      setInnerOffset={setInnerOffset}
      floatingRef={floatingRef}
      setValueAtIndex={(index, value) => {
        listContentRef.current[index] = value
      }}
      fallback={fallback}
      interactions={interactionsContext}
      floatingContext={context}
      activeIndex={activeIndex}
      canScrollDown={!!showDownArrow}
      canScrollUp={!!showUpArrow}
      controlledScrolling
      dataRef={context.dataRef}
      listRef={listItemsRef}
      blockSelection={blockSelection}
      allowMouseUpRef={allowMouseUpRef}
      upArrowRef={upArrowRef}
      downArrowRef={downArrowRef}
      selectTimeoutRef={selectTimeoutRef}
      allowSelectRef={allowSelectRef}
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

// Cross browser fixes for pinch-zooming/backdrop-filter 🙄
const userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) || ''
