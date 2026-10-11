import {
  inner,
  offset,
  size,
  useClick,
  useFloatingRaw as useFloatingDom,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type FloatingInteractionContext,
  type SideObject,
} from '@tamagui/floating'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createChangeEventDetails, useEvent, useIsTouchDevice } from '@tamagui/core'
import { composeEventHandlers } from '@tamagui/helpers'
import * as React from 'react'
import { SCROLL_ARROW_THRESHOLD } from './constants'
import {
  SelectItemParentProvider,
  SelectProvider,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import type {
  SelectActiveChangeDetails,
  SelectImplProps,
  SelectOpenChangeDetails,
} from './types'

export const SelectInlineImpl = (props: SelectImplProps) => {
  const { scope, children, open = false, listContentRef } = props

  const selectContext = useSelectContext(scope)
  const selectItemParentContext = useSelectItemParentContext(scope)
  const { setActiveIndex, selectedIndex, activeIndexRef } = selectContext

  const { requestOpenChange, registry, lastPointerRef } = selectItemParentContext

  const touch = useIsTouchDevice()

  const listItemsRef = selectItemParentContext.listRef!
  const overflowRef = React.useRef<null | SideObject>(null)
  const upArrowRef = React.useRef<HTMLDivElement | null>(null)
  const downArrowRef = React.useRef<HTMLDivElement | null>(null)
  const allowSelectRef = React.useRef(false)
  const allowMouseUpRef = React.useRef(true)
  const selectTimeoutRef = React.useRef<any>(null)
  const latestKeyboardEventRef = React.useRef<Event | undefined>(undefined)
  const state = React.useRef({
    isMouseOutside: false,
    isTyping: false,
  })

  const [controlledScrolling, setControlledScrolling] = React.useState(false)
  const [fallback, setFallback] = React.useState(false)
  const [blockSelection, setBlockSelection] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setCanScrollUp(false)
      setCanScrollDown(false)
      setFallback(false)
      setControlledScrolling(false)
    }
  }, [open])

  // close when mouseup outside select
  if (process.env.TAMAGUI_TARGET === 'web') {
    useIsomorphicLayoutEffect(() => {
      if (!open) return
      const mouseUp = (e: MouseEvent) => {
        if (state.current.isMouseOutside) {
          requestOpenChange(
            false,
            createChangeEventDetails('outside-press', e) as SelectOpenChangeDetails
          )
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
    // The removed alternate stack was the logic from floating-ui,
    // but it causes issues (open, drag select, close, then re-open its not positioned "over")
    // https://github.com/floating-ui/floating-ui/blob/master/packages/react/test/visual/components/MacSelect.tsx
    middleware: [
      size({
        apply({ rects, elements }) {
          // the list overhangs the trigger by 4px a side (with the -4 cross offset)
          elements.floating.style.minWidth = `${rects.reference.width + 8}px`
        },
      }),
      inner({
        listRef: listItemsRef,
        overflowRef,
        index: selectedIndex,
        onFallbackChange: setFallback,
        // arrows sit outside the scrollport, with room reserved at both screen edges
        get padding() {
          return (
            10 +
            Math.max(
              upArrowRef.current?.offsetHeight ?? 0,
              downArrowRef.current?.offsetHeight ?? 0
            )
          )
        },
        minItemsVisible: touch ? 10 : 4,
        referenceOverflowThreshold: 20,
      }),
      offset({ crossAxis: -4 }),
    ],
  } as any)

  // the arrows are booleans that flip at a threshold, never the scroll offset
  // itself, so a scroll event costs no render unless an arrow appears or goes
  const [canScrollUp, setCanScrollUp] = React.useState(false)
  const [canScrollDown, setCanScrollDown] = React.useState(false)
  const updateScrollArrows = React.useCallback(() => {
    const el = refs.floating.current
    if (!el) return
    setCanScrollUp(el.scrollTop > SCROLL_ARROW_THRESHOLD)
    setCanScrollDown(
      el.scrollTop < el.scrollHeight - el.clientHeight - SCROLL_ARROW_THRESHOLD
    )
  }, [refs])

  const showUpArrow = open && canScrollUp
  const showDownArrow = open && canScrollDown

  // the list is placed once per open, not kept in sync: the inner middleware
  // scrolls the list to align the selected item, so recomputing on a page
  // scroll would yank the list out from under the user's own scroll. the list
  // is absolutely positioned, so it rides along with page scroll on its own.
  useIsomorphicLayoutEffect(() => {
    if (!open) return
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update, open])

  const onMatch = useEvent((index: number) => {
    if (!open) return
    setActiveIndex(index, {
      reason: 'keyboard',
      event: latestKeyboardEventRef.current,
      trigger: undefined,
      index,
    } as SelectActiveChangeDetails)
  })

  // the interaction context for the floating hooks. every hook memoizes its
  // props on this object, and those props sit in the item context, so a new
  // identity here re-renders every item
  const dataRef = React.useRef<{ openEvent?: Event; placement?: string }>({})
  dataRef.current.placement = computedPlacement
  const onOpenChange = useEvent((nextOpen: boolean, event?: Event, reason?: string) => {
    requestOpenChange(
      nextOpen,
      createChangeEventDetails(
        reason === 'list-navigation' ? 'keyboard' : 'trigger-press',
        event,
        refs.reference.current
      ) as SelectOpenChangeDetails
    )
  })
  const referenceElement = (refs.reference.current as Element | null) || null
  const floatingElement = refs.floating.current || null
  const interactionContext: FloatingInteractionContext = React.useMemo(
    () => ({
      open,
      onOpenChange,
      refs: {
        reference: refs.reference as any,
        floating: refs.floating,
        domReference: refs.reference as any,
      },
      elements: {
        reference: referenceElement,
        floating: floatingElement,
        domReference: referenceElement,
      },
      dataRef,
    }),
    [open, onOpenChange, refs, referenceElement, floatingElement]
  )

  const interactionsProps = [
    useClick(interactionContext, { event: 'mousedown', keyboardHandlers: false }),
    // useDismiss removed - already handled by Dismissable in SelectContent
    useRole(interactionContext, { role: 'listbox' }),
    useListNavigation(interactionContext, {
      listRef: listItemsRef,
      // items focus themselves from the active-index emitter, and the hook's
      // own index syncs from item focus, so it never needs the value
      activeIndex: null,
      selectedIndex,
      onNavigate: (index) => {
        if (index !== null) {
          setActiveIndex(index, {
            reason: 'list-navigation',
            event: latestKeyboardEventRef.current,
            trigger: undefined,
            index,
          } as SelectActiveChangeDetails)
        }
      },
      disabledIndices: registry.getDisabledIndices(),
      scrollItemIntoView: false,
      // items own hover: the hook's leave handler would focus the viewport when
      // a scroll moves the list under a still pointer, losing the keyboard position
      focusItemOnHover: false,
    }),
    useTypeahead(interactionContext, {
      listRef: listContentRef,
      onMatch,
      selectedIndex,
      activeIndex: null,
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

  // the trigger and viewport getters. items get getItemProps alone, which is
  // stable once the list mounts, so the floating element mounting (a new
  // identity here) never re-renders the list
  const interactionsContext = React.useMemo(() => {
    return {
      getReferenceProps(props: Record<string, any> = {}) {
        return interactions.getReferenceProps({
          ...props,
          // the press that opens is the pointer's last real position: WebKit
          // replays a mousemove there whenever the list scrolls under it (say a
          // keyboard move scrolling the next item into view), and that replay
          // must not read as a hover
          onMouseDown: composeEventHandlers(props.onMouseDown, (event: any) => {
            const last = lastPointerRef.current
            last.x = event.clientX
            last.y = event.clientY
          }),
          onKeyDown: composeEventHandlers(props.onKeyDown, (event: any) => {
            latestKeyboardEventRef.current = event.nativeEvent || event
            if (
              event.key === 'Enter' ||
              event.code === 'Space' ||
              (event.key === ' ' && !state.current.isTyping)
            ) {
              event.preventDefault()
              requestOpenChange(
                true,
                createChangeEventDetails(
                  'keyboard',
                  event.nativeEvent || event,
                  refs.reference.current
                ) as SelectOpenChangeDetails
              )
            }
          }),
        })
      },
      getFloatingProps(props) {
        return interactions.getFloatingProps({
          ref: refs.floating,
          ...props,
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
          onKeyDown(event) {
            latestKeyboardEventRef.current = event.nativeEvent || event
            setControlledScrolling(true)
          },
          onContextMenu(e) {
            e.preventDefault()
          },
          onScroll: updateScrollArrows,
        })
      },
    }
  }, [refs, interactions, requestOpenChange, updateScrollArrows])

  const floatingPosition = React.useMemo(
    () => ({ position: strategy, top: y ?? '', left: x ?? '' }),
    [strategy, x, y]
  )

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
    setFallback(false)
    setBlockSelection(false)
  }, [open])

  useIsomorphicLayoutEffect(() => {
    if (!open && state.current.isMouseOutside) {
      state.current.isMouseOutside = false
    }
  }, [open])

  // scroll activeIndex into view during keyboard nav
  React.useEffect(() => {
    if (!open) return

    const scrollActiveIntoView = (index: number | null) => {
      if (controlledScrolling && index != null) {
        listItemsRef.current[index]?.scrollIntoView({ block: 'nearest' })
      }
      updateScrollArrows()
    }

    scrollActiveIntoView(activeIndexRef.current)

    return selectItemParentContext.activeIndexSubscribe(scrollActiveIntoView)
  }, [
    open,
    controlledScrolling,
    selectItemParentContext.activeIndexSubscribe,
    updateScrollArrows,
  ])

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
      updateScrollArrows={updateScrollArrows}
      fallback={fallback}
      floatingContext={floatingContext as any}
      interactions={interactionsContext}
      floatingPosition={floatingPosition}
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
        getItemProps={interactions.getItemProps}
        listRef={listItemsRef}
        selectTimeoutRef={selectTimeoutRef}
      >
        {children}
      </SelectItemParentProvider>
    </SelectProvider>
  )
}
