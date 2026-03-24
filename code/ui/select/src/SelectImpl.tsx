import {
  autoUpdate,
  flip,
  inner,
  offset,
  shift,
  size,
  useClick,
  useFloatingRaw as useFloatingDom,
  useInteractions,
  useInnerOffset,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingInteractionContext,
  type SideObject,
} from '@tamagui/floating'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
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
  const { scope, children, open = false, listContentRef, setActiveIndexFast } = props

  const selectContext = useSelectContext(scope)
  const selectItemParentContext = useSelectItemParentContext(scope)
  const { setActiveIndex, selectedIndex, activeIndexRef } = selectContext

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

  // sync activeIndex on open/close
  React.useEffect(() => {
    if (open) {
      setActiveIndexFast(selectedIndex ?? 0)
    } else {
      setScrollTop(0)
      setFallback(false)
      setActiveIndexFast(null)
      setControlledScrolling(false)
    }
  }, [open, selectedIndex, setActiveIndexFast])

  // close when mouseup outside select
  if (process.env.TAMAGUI_TARGET === 'web') {
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

  const {
    x,
    y,
    strategy,
    refs,
    update,
    placement: computedPlacement,
  } = useFloatingDom({
    open,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    // eslint-disable-next-line no-constant-condition
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
  } as any)

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

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('resize', update)
    if (open) {
      update()
    }
    return () => window.removeEventListener('resize', update)
  }, [update, open])

  const onMatch = useEvent((index: number) => {
    const fn = open ? setActiveIndex : setSelectedIndex
    return fn(index)
  })

  // construct interaction context for our custom hooks
  const dataRef = React.useRef<{ openEvent?: Event; placement?: string }>({})
  dataRef.current.placement = computedPlacement
  const interactionContext: FloatingInteractionContext = {
    open,
    onOpenChange: (val) => setOpen(val),
    refs: {
      reference: refs.reference as any,
      floating: refs.floating,
      domReference: refs.reference as any,
    },
    elements: {
      reference: (refs.reference?.current as Element) || null,
      floating: refs.floating?.current || null,
      domReference: (refs.reference?.current as Element) || null,
    },
    dataRef,
  }

  const interactionsProps = [
    useClick(interactionContext, { event: 'mousedown', keyboardHandlers: false }),
    // useDismiss removed - already handled by Dismissable in SelectContent
    useRole(interactionContext, { role: 'listbox' }),
    useInnerOffset(interactionContext, {
      enabled: !fallback && isScrollable,
      onChange: setInnerOffset,
      overflowRef,
      scrollRef: refs.floating,
    }),
    useListNavigation(interactionContext, {
      listRef: listItemsRef,
      activeIndex: selectContext.activeIndex ?? 0,
      selectedIndex,
      onNavigate: (index) => {
        if (index !== null) {
          setActiveIndex(index)
        }
      },
      scrollItemIntoView: false,
    }),
    useTypeahead(interactionContext, {
      listRef: listContentRef,
      onMatch,
      selectedIndex,
      activeIndex: selectContext.activeIndex,
      onTypingChange: (e) => {
        state.current.isTyping = e
      },
    }),
  ]

  const interactions = useInteractions(
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
            position: strategy,
            top: y ?? '',
            left: x ?? '',
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
  }, [refs.reference.current, x, y, refs.floating.current, interactions])

  // effects

  useIsomorphicLayoutEffect(() => {
    if (open) {
      allowMouseUpRef.current = false

      selectTimeoutRef.current = setTimeout(() => {
        allowSelectRef.current = true
        allowMouseUpRef.current = true
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

  // dismiss on outside pointer down (arrows are outside the floating DOM tree)
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

  // scroll activeIndex into view during keyboard nav
  React.useEffect(() => {
    if (!open) return

    const scrollActiveIntoView = (index: number | null) => {
      if (controlledScrolling && index != null) {
        listItemsRef.current[index]?.scrollIntoView({ block: 'nearest' })
      }
      setScrollTop(refs.floating.current?.scrollTop ?? 0)
    }

    scrollActiveIntoView(activeIndexRef.current)

    return selectItemParentContext.activeIndexSubscribe(scrollActiveIntoView)
  }, [open, refs, controlledScrolling, selectItemParentContext.activeIndexSubscribe])

  React.useEffect(() => {
    if (open && fallback) {
      if (selectedIndex != null) {
        listItemsRef.current[selectedIndex]?.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [open, fallback, selectedIndex])

  useIsomorphicLayoutEffect(() => {
    if (refs.floating.current && fallback) {
      refs.floating.current.style.maxHeight = ''
    }
  }, [refs, fallback])

  // build a minimal floating context for SelectViewport/SelectScrollButton
  const floatingContext = React.useMemo(
    () => ({
      refs,
      dataRef,
    }),
    [refs]
  )

  return (
    <SelectProvider
      scope={scope}
      {...(selectContext as Required<typeof selectContext>)}
      setScrollTop={setScrollTop}
      setInnerOffset={setInnerOffset}
      fallback={fallback}
      floatingContext={floatingContext as any}
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
        dataRef={dataRef as any}
        interactions={interactionsContext}
        listRef={listItemsRef}
        selectTimeoutRef={selectTimeoutRef}
      >
        {children}
      </SelectItemParentProvider>
    </SelectProvider>
  )
}
