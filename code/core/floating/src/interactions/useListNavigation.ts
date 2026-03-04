import * as React from 'react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useEvent } from '@tamagui/use-event'
import type {
  ElementProps,
  FloatingInteractionContext,
  UseListNavigationProps,
} from './types'
import {
  activeElement,
  enqueueFocus,
  findNonDisabledListIndex,
  getMinListIndex,
  getMaxListIndex,
  isHTMLElement,
  isIndexOutOfListBounds,
  isTypeableCombobox,
  isVirtualClick,
  isVirtualPointerEvent,
  stopEvent,
} from './utils'

const ARROW_UP = 'ArrowUp'
const ARROW_DOWN = 'ArrowDown'
const ARROW_LEFT = 'ArrowLeft'
const ARROW_RIGHT = 'ArrowRight'

function doSwitch(
  orientation: UseListNavigationProps['orientation'],
  vertical: boolean,
  horizontal: boolean
) {
  switch (orientation) {
    case 'vertical':
      return vertical
    case 'horizontal':
      return horizontal
    default:
      return vertical || horizontal
  }
}

function isMainOrientationKey(
  key: string,
  orientation: UseListNavigationProps['orientation']
) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT
  return doSwitch(orientation, vertical, horizontal)
}

function isMainOrientationToEndKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean
) {
  const vertical = key === ARROW_DOWN
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT
  return (
    doSwitch(orientation, vertical, horizontal) ||
    key === 'Enter' ||
    key === ' ' ||
    key === ''
  )
}

function isCrossOrientationOpenKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT
  const horizontal = key === ARROW_DOWN
  return doSwitch(orientation, vertical, horizontal)
}

function isCrossOrientationCloseKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT
  const horizontal = key === ARROW_UP
  return doSwitch(orientation, vertical, horizontal)
}

// arrow key-based navigation of a list of items, with real or virtual (aria-activedescendant) focus
export function useListNavigation(
  context: FloatingInteractionContext,
  props: UseListNavigationProps
): ElementProps {
  const { open, onOpenChange, elements } = context
  const {
    listRef,
    activeIndex,
    onNavigate: unstable_onNavigate = () => {},
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = undefined,
    orientation = 'vertical',
    scrollItemIntoView = true,
  } = props

  const typeableComboboxReference = isTypeableCombobox(elements.domReference)

  const focusItemOnOpenRef = useRef(focusItemOnOpen)
  const indexRef = useRef(selectedIndex ?? -1)
  const keyRef = useRef<null | string>(null)
  const isPointerModalityRef = useRef(true)
  const previousMountedRef = useRef(!!elements.floating)
  const previousOpenRef = useRef(open)
  const forceSyncFocusRef = useRef(false)
  const forceScrollIntoViewRef = useRef(false)

  // latest-value refs
  const disabledIndicesRef = useRef(disabledIndices)
  disabledIndicesRef.current = disabledIndices
  const latestOpenRef = useRef(open)
  latestOpenRef.current = open
  const scrollItemIntoViewRef = useRef(scrollItemIntoView)
  scrollItemIntoViewRef.current = scrollItemIntoView
  const selectedIndexRef = useRef(selectedIndex)
  selectedIndexRef.current = selectedIndex

  // stable callback via useEvent
  const stableOnNavigate = useEvent(unstable_onNavigate)

  const [activeId, setActiveId] = useState<string | undefined>()

  // stable onNavigate that reads from indexRef
  const onNavigate = useEvent(() => {
    stableOnNavigate(indexRef.current === -1 ? null : indexRef.current)
  })

  // store previous onNavigate for cleanup
  const previousOnNavigateRef = useRef(onNavigate)

  const focusItem = useEvent(() => {
    function runFocus(item: HTMLElement) {
      if (virtual) {
        setActiveId(item.id)
      } else {
        enqueueFocus(item, {
          sync: forceSyncFocusRef.current,
          preventScroll: true,
        })
      }
    }

    const initialItem = listRef.current[indexRef.current]
    const forceScrollIntoView = forceScrollIntoViewRef.current

    if (initialItem) {
      runFocus(initialItem)
    }

    const scheduler = forceSyncFocusRef.current
      ? (v: () => void) => v()
      : requestAnimationFrame

    scheduler(() => {
      const waitedItem = listRef.current[indexRef.current] || initialItem

      if (!waitedItem) return

      if (!initialItem) {
        runFocus(waitedItem)
      }

      const scrollIntoViewOptions = scrollItemIntoViewRef.current
      const shouldScrollIntoView =
        scrollIntoViewOptions &&
        waitedItem &&
        (forceScrollIntoView || !isPointerModalityRef.current)

      if (shouldScrollIntoView) {
        waitedItem.scrollIntoView?.(
          typeof scrollIntoViewOptions === 'boolean'
            ? { block: 'nearest', inline: 'nearest' }
            : scrollIntoViewOptions
        )
      }
    })
  })

  // sync selectedIndex to activeIndex on open, reset on close
  useLayoutEffect(() => {
    if (!enabled) return

    if (open && elements.floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        forceScrollIntoViewRef.current = true
        indexRef.current = selectedIndex
        onNavigate()
      }
    } else if (previousMountedRef.current) {
      indexRef.current = -1
      previousOnNavigateRef.current()
    }
  }, [enabled, open, elements.floating, selectedIndex, onNavigate])

  // sync activeIndex to focused item while open
  useLayoutEffect(() => {
    if (!enabled) return
    if (!open) return
    if (!elements.floating) return

    if (activeIndex == null) {
      forceSyncFocusRef.current = false

      if (selectedIndexRef.current != null) {
        return
      }

      // reset while the floating element was open (e.g. the list changed)
      if (previousMountedRef.current) {
        indexRef.current = -1
        focusItem()
      }

      // initial sync
      if (
        (!previousOpenRef.current || !previousMountedRef.current) &&
        focusItemOnOpenRef.current &&
        (keyRef.current != null ||
          (focusItemOnOpenRef.current === true && keyRef.current == null))
      ) {
        let runs = 0
        const waitForListPopulated = () => {
          if (listRef.current[0] == null) {
            if (runs < 2) {
              const scheduler = runs ? requestAnimationFrame : queueMicrotask
              scheduler(waitForListPopulated)
            }
            runs++
          } else {
            indexRef.current =
              keyRef.current == null ||
              isMainOrientationToEndKey(keyRef.current, orientation, rtl) ||
              nested
                ? getMinListIndex(listRef, disabledIndicesRef.current)
                : getMaxListIndex(listRef, disabledIndicesRef.current)
            keyRef.current = null
            onNavigate()
          }
        }

        waitForListPopulated()
      }
    } else if (!isIndexOutOfListBounds(listRef, activeIndex)) {
      indexRef.current = activeIndex
      focusItem()
      forceScrollIntoViewRef.current = false
    }
  }, [
    enabled,
    open,
    elements.floating,
    activeIndex,
    selectedIndexRef,
    nested,
    listRef,
    orientation,
    rtl,
    onNavigate,
    focusItem,
    disabledIndicesRef,
  ])

  // track previous state
  useLayoutEffect(() => {
    previousOnNavigateRef.current = onNavigate
    previousOpenRef.current = open
    previousMountedRef.current = !!elements.floating
  })

  useLayoutEffect(() => {
    if (!open) {
      keyRef.current = null
      focusItemOnOpenRef.current = focusItemOnOpen
    }
  }, [open, focusItemOnOpen])

  const hasActiveIndex = activeIndex != null

  const commonOnKeyDown = useEvent((event: React.KeyboardEvent) => {
    isPointerModalityRef.current = false
    forceSyncFocusRef.current = true

    // composing character check (chrome fires ArrowDown twice)
    if (event.which === 229) {
      return
    }

    // if floating element is animating out, ignore navigation
    if (!latestOpenRef.current && event.currentTarget === elements.floating) {
      return
    }

    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
      stopEvent(event)
      onOpenChange(false, event.nativeEvent, 'list-navigation')

      if (isHTMLElement(elements.domReference)) {
        elements.domReference.focus()
      }

      return
    }

    const currentIndex = indexRef.current
    const minIndex = getMinListIndex(listRef, disabledIndices)
    const maxIndex = getMaxListIndex(listRef, disabledIndices)

    if (!typeableComboboxReference) {
      if (event.key === 'Home') {
        stopEvent(event)
        indexRef.current = minIndex
        onNavigate()
      }

      if (event.key === 'End') {
        stopEvent(event)
        indexRef.current = maxIndex
        onNavigate()
      }
    }

    if (isMainOrientationKey(event.key, orientation)) {
      stopEvent(event)

      // reset the index if no item is focused
      if (
        open &&
        !virtual &&
        activeElement(event.currentTarget.ownerDocument) === event.currentTarget
      ) {
        indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl)
          ? minIndex
          : maxIndex
        onNavigate()
        return
      }

      if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
        if (loop) {
          indexRef.current =
            currentIndex >= maxIndex
              ? allowEscape && currentIndex !== listRef.current.length
                ? -1
                : minIndex
              : findNonDisabledListIndex(listRef, {
                  startingIndex: currentIndex,
                  disabledIndices,
                })
        } else {
          indexRef.current = Math.min(
            maxIndex,
            findNonDisabledListIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices,
            })
          )
        }
      } else {
        if (loop) {
          indexRef.current =
            currentIndex <= minIndex
              ? allowEscape && currentIndex !== -1
                ? listRef.current.length
                : maxIndex
              : findNonDisabledListIndex(listRef, {
                  startingIndex: currentIndex,
                  decrement: true,
                  disabledIndices,
                })
        } else {
          indexRef.current = Math.max(
            minIndex,
            findNonDisabledListIndex(listRef, {
              startingIndex: currentIndex,
              decrement: true,
              disabledIndices,
            })
          )
        }
      }

      if (isIndexOutOfListBounds(listRef, indexRef.current)) {
        indexRef.current = -1
      }

      onNavigate()
    }
  })

  const ariaActiveDescendantProp = useMemo(() => {
    return (
      virtual &&
      open &&
      hasActiveIndex && {
        'aria-activedescendant': activeId,
      }
    )
  }, [virtual, open, hasActiveIndex, activeId])

  const floating: ElementProps['floating'] = useMemo(() => {
    return {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(!typeableComboboxReference ? ariaActiveDescendantProp : {}),
      onKeyDown: commonOnKeyDown,
      onPointerMove() {
        isPointerModalityRef.current = true
      },
    }
  }, [ariaActiveDescendantProp, commonOnKeyDown, orientation, typeableComboboxReference])

  const reference: ElementProps['reference'] = useMemo(() => {
    function checkVirtualMouse(event: React.PointerEvent) {
      if (focusItemOnOpen === 'auto' && isVirtualClick(event.nativeEvent)) {
        focusItemOnOpenRef.current = true
      }
    }

    function checkVirtualPointer(event: React.PointerEvent) {
      focusItemOnOpenRef.current = focusItemOnOpen
      if (focusItemOnOpen === 'auto' && isVirtualPointerEvent(event.nativeEvent)) {
        focusItemOnOpenRef.current = true
      }
    }

    return {
      ...ariaActiveDescendantProp,
      onKeyDown(event: any) {
        isPointerModalityRef.current = false

        const isArrowKey = event.key.startsWith('Arrow')
        const isCrossOpenKey = isCrossOrientationOpenKey(event.key, orientation, rtl)
        const isMainKey = isMainOrientationKey(event.key, orientation)
        const isNavigationKey =
          (nested ? isCrossOpenKey : isMainKey) ||
          event.key === 'Enter' ||
          event.key.trim() === ''

        if (virtual && open) {
          return commonOnKeyDown(event)
        }

        // if a floating element should not open on arrow key down, avoid
        // setting activeIndex while it's closed
        if (!open && !openOnArrowKeyDown && isArrowKey) {
          return
        }

        if (isNavigationKey) {
          keyRef.current = event.key
        }

        if (nested) {
          if (isCrossOpenKey) {
            stopEvent(event)

            if (open) {
              indexRef.current = getMinListIndex(listRef, disabledIndicesRef.current)
              onNavigate()
            } else {
              onOpenChange(true, event.nativeEvent, 'list-navigation')
            }
          }

          return
        }

        if (isMainKey) {
          if (selectedIndex != null) {
            indexRef.current = selectedIndex
          }

          stopEvent(event)

          if (!open && openOnArrowKeyDown) {
            onOpenChange(true, event.nativeEvent, 'list-navigation')
          } else {
            commonOnKeyDown(event)
          }

          if (open) {
            onNavigate()
          }
        }
      },
      onFocus() {
        if (open && !virtual) {
          indexRef.current = -1
          onNavigate()
        }
      },
      onPointerDown: checkVirtualPointer,
      onPointerEnter: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse,
    }
  }, [
    ariaActiveDescendantProp,
    commonOnKeyDown,
    disabledIndicesRef,
    focusItemOnOpen,
    listRef,
    nested,
    onNavigate,
    onOpenChange,
    open,
    openOnArrowKeyDown,
    orientation,
    rtl,
    selectedIndex,
    virtual,
  ])

  const item = useMemo(() => {
    function syncCurrentTarget(currentTarget: HTMLElement | null) {
      if (!latestOpenRef.current) return
      const index = listRef.current.indexOf(currentTarget)
      if (index !== -1 && indexRef.current !== index) {
        indexRef.current = index
        onNavigate()
      }
    }

    const itemProps: ElementProps['item'] = {
      onFocus({ currentTarget }: any) {
        forceSyncFocusRef.current = true
        syncCurrentTarget(currentTarget)
      },
      onClick: ({ currentTarget }: any) => currentTarget.focus({ preventScroll: true }), // safari
      onMouseMove({ currentTarget }: any) {
        forceSyncFocusRef.current = true
        forceScrollIntoViewRef.current = false
        if (focusItemOnHover) {
          syncCurrentTarget(currentTarget)
        }
      },
      onPointerLeave({ pointerType }: any) {
        if (!isPointerModalityRef.current || pointerType === 'touch') {
          return
        }

        forceSyncFocusRef.current = true

        if (!focusItemOnHover) {
          return
        }

        indexRef.current = -1
        onNavigate()

        if (!virtual) {
          elements.floating?.focus({ preventScroll: true })
        }
      },
    }

    return itemProps
  }, [latestOpenRef, focusItemOnHover, listRef, onNavigate, virtual, elements.floating])

  return useMemo(
    () => (enabled ? { reference, floating, item } : {}),
    [enabled, reference, floating, item]
  )
}
