import { createCollection } from '@tamagui/collection'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { Stack, createStyledContext, useEvent } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import * as React from 'react'

const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/* -----------------------------------------------------------------------------------------------*/

type RovingFocusGroupImplElement = React.ElementRef<typeof Stack>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>
interface RovingFocusGroupImplProps
  extends Omit<PrimitiveDivProps, 'dir'>,
    RovingFocusGroupOptions {
  currentTabStopId?: string | null
  defaultCurrentTabStopId?: string
  onCurrentTabStopIdChange?: (tabStopId: string | null) => void
  onEntryFocus?: (event: Event) => void
}

const RovingFocusGroupImpl = React.forwardRef<
  RovingFocusGroupImplElement,
  ScopedProps<RovingFocusGroupImplProps>
>((props: ScopedProps<RovingFocusGroupImplProps>, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    ...groupProps
  } = props
  const ref = React.useRef<RovingFocusGroupImplElement>(null)
  const composedRefs = useComposedRefs(forwardedRef, ref)
  const direction = useDirection(dir)
  const [currentTabStopId = null, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
  })
  const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false)
  const handleEntryFocus = useEvent(onEntryFocus)
  const getItems = useCollection(__scopeRovingFocusGroup || ROVING_FOCUS_GROUP_CONTEXT)
  const isClickFocusRef = React.useRef(false)
  const [focusableItemsCount, setFocusableItemsCount] = React.useState(0)

  React.useEffect(() => {
    const node = (ref as unknown as React.RefObject<HTMLDivElement>).current
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus)
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus)
    }
  }, [handleEntryFocus])

  return (
    <RovingFocusProvider
      scope={__scopeRovingFocusGroup}
      orientation={orientation}
      dir={direction}
      loop={loop}
      currentTabStopId={currentTabStopId}
      onItemFocus={React.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      )}
      onItemShiftTab={React.useCallback(() => setIsTabbingBackOut(true), [])}
      onFocusableItemAdd={React.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      )}
      onFocusableItemRemove={React.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      )}
    >
      <Stack
        tabIndex={isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0}
        data-orientation={orientation}
        {...groupProps}
        ref={composedRefs}
        // @ts-ignore
        style={[{ outline: 'none' }, props.style]}
        onMouseDown={composeEventHandlers(props.onMouseDown, () => {
          isClickFocusRef.current = true
        })}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          // We normally wouldn't need this check, because we already check
          // that the focus is on the current target and not bubbling to it.
          // We do this because Safari doesn't focus buttons when clicked, and
          // instead, the wrapper will get focused and not through a bubbling event.
          const isKeyboardFocus = !isClickFocusRef.current

          if (
            event.target === event.currentTarget &&
            isKeyboardFocus &&
            !isTabbingBackOut
          ) {
            const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS)
            event.currentTarget.dispatchEvent(entryFocusEvent)

            if (!entryFocusEvent.defaultPrevented) {
              const items = getItems().filter((item) => item.focusable)
              const activeItem = items.find((item) => item.active)
              const currentItem = items.find((item) => item.id === currentTabStopId)
              const candidateItems = [activeItem, currentItem, ...items].filter(
                Boolean
              ) as typeof items
              const candidateNodes = candidateItems.map((item) => item.ref.current!)
              focusFirst(candidateNodes)
            }
          }

          isClickFocusRef.current = false
        })}
        // @ts-ignore
        onBlur={composeEventHandlers((props as any).onBlur, () =>
          setIsTabbingBackOut(false)
        )}
      />
    </RovingFocusProvider>
  )
})

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RovingFocusGroupItem'

type RovingFocusItemElement = React.ElementRef<typeof Stack>
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Stack>
interface RovingFocusItemProps extends PrimitiveSpanProps {
  tabStopId?: string
  focusable?: boolean
  active?: boolean
}

const RovingFocusGroupItem = React.forwardRef<
  RovingFocusItemElement,
  ScopedProps<RovingFocusItemProps>
>((props: ScopedProps<RovingFocusItemProps>, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    focusable = true,
    active = false,
    tabStopId,
    ...itemProps
  } = props
  const autoId = React.useId()
  const id = tabStopId || autoId
  const context = useRovingFocusContext(__scopeRovingFocusGroup)
  const isCurrentTabStop = context.currentTabStopId === id
  const getItems = useCollection(__scopeRovingFocusGroup || ROVING_FOCUS_GROUP_CONTEXT)

  const { onFocusableItemAdd, onFocusableItemRemove } = context

  React.useEffect(() => {
    if (focusable) {
      onFocusableItemAdd()
      return () => onFocusableItemRemove()
    }
  }, [focusable, onFocusableItemAdd, onFocusableItemRemove])

  return (
    <Collection.ItemSlot
      __scopeCollection={__scopeRovingFocusGroup || ROVING_FOCUS_GROUP_CONTEXT}
      id={id}
      focusable={focusable}
      active={active}
    >
      <Stack
        tabIndex={isCurrentTabStop ? 0 : -1}
        data-orientation={context.orientation}
        {...itemProps}
        ref={forwardedRef}
        onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
          // We prevent focusing non-focusable items on `mousedown`.
          // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
          if (!focusable) event.preventDefault()
          // Safari doesn't focus a button when clicked so we run our logic on mousedown also
          else context.onItemFocus(id)
        })}
        onFocus={composeEventHandlers(props.onFocus, () => context.onItemFocus(id))}
        {...(isWeb && {
          onKeyDown: composeEventHandlers(
            (props as React.ComponentProps<'span'>).onKeyDown,
            (event) => {
              if (event.key === 'Tab' && event.shiftKey) {
                context.onItemShiftTab()
                return
              }

              if (event.target !== event.currentTarget) return

              const focusIntent = getFocusIntent(event, context.orientation, context.dir)

              if (focusIntent !== undefined) {
                event.preventDefault()
                const items = getItems().filter((item) => item.focusable)
                let candidateNodes = items.map((item) => item.ref.current!)

                if (focusIntent === 'last') candidateNodes.reverse()
                else if (focusIntent === 'prev' || focusIntent === 'next') {
                  if (focusIntent === 'prev') candidateNodes.reverse()
                  const currentIndex = candidateNodes.indexOf(event.currentTarget)
                  candidateNodes = context.loop
                    ? wrapArray(candidateNodes, currentIndex + 1)
                    : candidateNodes.slice(currentIndex + 1)
                }

                /**
                 * Imperative focus during keydown is risky so we prevent React's batching updates
                 * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
                 */
                setTimeout(() => focusFirst(candidateNodes))
              }
            }
          ),
        })}
      />
    </Collection.ItemSlot>
  )
})

RovingFocusGroupItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * RovingFocusGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'RovingFocusGroup'

type ItemData = { id: string; focusable: boolean; active: boolean }
const [Collection, useCollection] = createCollection<HTMLSpanElement, ItemData>(
  GROUP_NAME
)

type ScopedProps<P> = P & { __scopeRovingFocusGroup?: string }
// const [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
//   GROUP_NAME,
//   [createCollectionScope]
// )

type Orientation = React.AriaAttributes['aria-orientation']
type Direction = 'ltr' | 'rtl'

interface RovingFocusGroupOptions {
  /**
   * The orientation of the group.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   */
  orientation?: Orientation
  /**
   * The direction of navigation between items.
   */
  dir?: Direction
  /**
   * Whether keyboard navigation should loop around
   * @defaultValue false
   */
  loop?: boolean
}

type RovingContextValue = RovingFocusGroupOptions & {
  currentTabStopId: string | null
  onItemFocus(tabStopId: string): void
  onItemShiftTab(): void
  onFocusableItemAdd(): void
  onFocusableItemRemove(): void
}

// const [RovingFocusProvider, useRovingFocusContext] =
//   createRovingFocusGroupContext<RovingContextValue>(GROUP_NAME)

const { Provider: RovingFocusProvider, useStyledContext: useRovingFocusContext } =
  createStyledContext<RovingContextValue>()

type RovingFocusGroupElement = RovingFocusGroupImplElement
interface RovingFocusGroupProps extends RovingFocusGroupImplProps {}

const ROVING_FOCUS_GROUP_CONTEXT = 'RovingFocusGroupContext'

const RovingFocusGroup = withStaticProperties(
  React.forwardRef<RovingFocusGroupElement, ScopedProps<RovingFocusGroupProps>>(
    (props: ScopedProps<RovingFocusGroupProps>, forwardedRef) => {
      return (
        <Collection.Provider
          __scopeCollection={props.__scopeRovingFocusGroup || ROVING_FOCUS_GROUP_CONTEXT}
        >
          <Collection.Slot
            __scopeCollection={
              props.__scopeRovingFocusGroup || ROVING_FOCUS_GROUP_CONTEXT
            }
          >
            <RovingFocusGroupImpl {...props} ref={forwardedRef} />
          </Collection.Slot>
        </Collection.Provider>
      )
    }
  ),
  {
    Item: RovingFocusGroupItem,
  }
)

RovingFocusGroup.displayName = GROUP_NAME

/* -----------------------------------------------------------------------------------------------*/

// prettier-ignore
const MAP_KEY_TO_FOCUS_INTENT: Record<string, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
}

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

type FocusIntent = 'first' | 'last' | 'prev' | 'next'

function getFocusIntent(
  event: React.KeyboardEvent,
  orientation?: Orientation,
  dir?: Direction
) {
  const key = getDirectionAwareKey(event.key, dir)
  if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key))
    return undefined
  if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key))
    return undefined
  return MAP_KEY_TO_FOCUS_INTENT[key]
}

function focusFirst(candidates: HTMLElement[]) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement
  for (const candidate of candidates) {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return
    candidate.focus()
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return
  }
}

/**
 * Wraps an array around itself at a given start index
 * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
 */
function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}

export { RovingFocusGroup }

export type { RovingFocusGroupProps, RovingFocusItemProps }
