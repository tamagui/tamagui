import { createCollection } from '@tamagui/collection'
import { isWeb, type Stack } from '@tamagui/core'
import { Collapsible } from '@tamagui/collapsible'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import { useComposedRefs } from '@tamagui/compose-refs'
import { composeEventHandlers } from '@tamagui/helpers'
import { createContext } from 'react'
import React = require('react')
import type { View } from 'react-native'

// TODO: make DX better by mentioning the order of using things

type TamaguiElement = HTMLElement | View
const ACCORDION_NAME = 'Accordion'
const [Collection, useCollection] = createCollection<TamaguiElement>(ACCORDION_NAME)

export function useAccordion<T extends 'single' | 'multiple'>(
  type: T,
  params: T extends 'single' ? AccordionImplSingleProps : AccordionImplMultipleProps
) {
  if (type === 'single') {
    return useAccordionImpl(useSingleAccordion(params as AccordionImplSingleProps))
  }
  return useAccordionImpl(useMultipleAccordion(params as AccordionImplMultipleProps))
}

type AccordionValueContextValue = {
  value: string[]
  onItemOpen(value: string): void
  onItemClose(value: string): void
}

const AccordionValueContext = createContext<AccordionValueContextValue | null>(null)

function useAccordionValueContext() {
  const context = React.useContext(AccordionValueContext)
  if (context === null) {
    throw new Error('useAccordionValueContext must be used within an Accordion')
  }
  return context
}

const AccordionCollapsibleContext = createContext<any>(false)
function useAccordionCollapsibleContext() {
  const context = React.useContext(AccordionCollapsibleContext)
  if (context === null) {
    throw new Error('useAccordionCollapsibleContext must be used within an Accordion')
  }
  return context
}

function useSingleAccordion(params: AccordionImplSingleProps) {
  const {
    value: valueProp,
    defaultValue,
    control,
    onValueChange = () => {},
    collapsible = false,
    ...accordionSingleProps
  } = params

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue || '',
    onChange: onValueChange,
  })

  return {
    ValueProvider: AccordionValueContext.Provider,
    valueProviderValue: {
      value: value ? [value] : [],
      onItemOpen: setValue,
      onItemClose: React.useCallback(
        (_: string) => collapsible && setValue(''),
        [setValue, collapsible]
      ),
    },
    CollapsibleProvider: AccordionCollapsibleContext.Provider,
    collapsibleProviderValue: {
      collapsible,
    },
    ...accordionSingleProps,
  }
}

function useMultipleAccordion(params: AccordionImplMultipleProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...accordionMultipleProps
  } = params

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue || [],
    onChange: onValueChange,
  })

  const handleItemOpen = React.useCallback(
    (itemValue: string) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  )

  const handleItemClose = React.useCallback(
    (itemValue: string) =>
      setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
    [setValue]
  )

  return {
    ValueProvider: AccordionValueContext.Provider,
    valueProviderValue: {
      value,
      onItemOpen: handleItemOpen,
      onItemClose: handleItemClose,
    },
    CollapsibleProvider: AccordionCollapsibleContext.Provider,
    collapsibleProviderValue: {
      collapsible: true,
    },
    ...accordionMultipleProps,
  }
}

const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']

type AccordionImplContextValue = {
  disabled?: boolean
  direction: AccordionImplProps['dir']
  orientation: AccordionImplProps['orientation']
}

const AccordionImplContext = createContext<AccordionImplContextValue | null>(null)

function useAccordionContext() {
  const context = React.useContext(AccordionImplContext)
  if (context === null) {
    throw new Error('useAccordionContext must be used within an AccordionImplProvider')
  }
  return context
}

type ReturnTypeOfUseSingleMultipleAccordion = ReturnType<typeof useSingleAccordion> &
  ReturnType<typeof useMultipleAccordion>

function useAccordionImpl(
  params: AccordionImplProps & ReturnTypeOfUseSingleMultipleAccordion
) {
  const {
    disabled,
    dir,
    orientation = 'vertical',
    ValueProvider,
    valueProviderValue,
    CollapsibleProvider,
    collapsibleProviderValue,
    ...accordionProps
  } = params

  const accordionRef = React.useRef<TamaguiElement>(null)
  // TODO: handle forwardedRef, here the second argument was a forwardedRef
  const composedRef = useComposedRefs(accordionRef, () => {})
  // TODO: ACCORDION_CONTEXT make sure is used when using Providers, and how to handle _scope here
  const getItems = useCollection(ACCORDION_CONTEXT)
  const direction = useDirection(dir)
  const isDirectionLTR = direction === 'ltr'
  const handleKeyDown = composeEventHandlers(
    (params as any).onKeyDown,
    (event: KeyboardEvent) => {
      if (!ACCORDION_KEYS.includes(event.key)) return
      const target = event.target as HTMLElement
      const triggerCollection = getItems().filter((item) => {
        const el = item.ref.current as { disabled?: boolean } | null
        return !el?.disabled
      })
      const triggerIndex = triggerCollection.findIndex(
        (item) => item.ref.current === target
      )
      const triggerCount = triggerCollection.length

      if (triggerIndex === -1) return

      // Prevents page scroll while user is navigating
      event.preventDefault()

      let nextIndex = triggerIndex
      const homeIndex = 0
      const endIndex = triggerCount - 1

      const moveNext = () => {
        nextIndex = triggerIndex + 1
        if (nextIndex > endIndex) {
          nextIndex = homeIndex
        }
      }

      const movePrev = () => {
        nextIndex = triggerIndex - 1
        if (nextIndex < homeIndex) {
          nextIndex = endIndex
        }
      }

      switch (event.key) {
        case 'Home':
          nextIndex = homeIndex
          break
        case 'End':
          nextIndex = endIndex
          break
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            if (isDirectionLTR) {
              moveNext()
            } else {
              movePrev()
            }
          }
          break
        case 'ArrowDown':
          if (orientation === 'vertical') {
            moveNext()
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            if (isDirectionLTR) {
              movePrev()
            } else {
              moveNext()
            }
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical') {
            movePrev()
          }
          break
      }

      const clampedIndex = nextIndex % triggerCount
      triggerCollection[clampedIndex].ref.current?.focus()
    }
  )

  return {
    AccordionImplProvider: AccordionImplContext.Provider,
    accordionImplProviderValue: {
      disabled,
      direction,
      orientation,
    },
    CollectionSlot: Collection.Slot,
    frameProps: {
      'data-orientation': orientation,
      ref: composedRef,
      ...(isWeb && {
        onKeyDown: handleKeyDown,
      }),
      ...accordionProps,
    },
    ValueProvider,
    valueProviderValue,
    collapsibleProviderValue,
  }
}

const ACCORDION_CONTEXT = 'Accordion'

type Direction = 'ltr' | 'rtl'
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Stack>
interface AccordionImplProps extends PrimitiveDivProps {
  /**
   * Whether or not an accordion is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The layout in which the Accordion operates.
   * @default vertical
   */
  orientation?: React.AriaAttributes['aria-orientation']
  /**
   * The language read direction.
   */
  dir?: Direction
  /**
   *  The callback that fires when the state of the accordion changes. for use with `useAccordion`
   * @param selected - The values of the accordion items whose contents are expanded.
   */
  control?(selected: string[]): void
}

interface AccordionImplSingleProps extends AccordionImplProps {
  /**
   * The controlled stateful value of the accordion item whose content is expanded.
   */
  value?: string
  /**
   * The value of the item whose content is expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultValue?: string
  /**
   * The callback that fires when the state of the accordion changes.
   */
  onValueChange?(value: string): void
  /**
   * Whether an accordion item can be collapsed after it has been opened.
   * @default false
   */
  collapsible?: boolean
}

interface AccordionImplMultipleProps extends AccordionImplProps {
  /**
   * The controlled stateful value of the accordion items whose contents are expanded.
   */
  value?: string[]
  /**
   * The value of the items whose contents are expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultValue?: string[]
  /**
   * The callback that fires when the state of the accordion changes.
   */
  onValueChange?(value: string[]): void
}

interface UseAccordionItemParams {
  value: string
  disabled?: boolean
}

type AccordionItemContextValue = { open?: boolean; disabled?: boolean; triggerId: string }
const AccordionItemContext = createContext<AccordionItemContextValue>(null)
function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext)
  if (context === null) {
    throw new Error('useAccordionItemContext must be used within an AccordionItem')
  }
  return context
}

function getState(open?: boolean) {
  return open ? 'open' : 'closed'
}

export function useAccordionItem(params: UseAccordionItemParams) {
  const { value } = params
  const accordionContext = useAccordionContext()
  const itemContext = useAccordionItemContext()
  const collapsibleContext = useAccordionCollapsibleContext()
  const valueContext = useAccordionValueContext()

  const open = (params.value && valueContext.value.includes(params.value)) || false
  const disabled = accordionContext.disabled || params.disabled
  return {
    trigger: {
      ItemSlot: Collection.ItemSlot,
      frame: {
        'aria-disabled':
          (itemContext.open && !collapsibleContext.collapsible) || undefined,
        'data-orientation': accordionContext.orientation,
        id: itemContext.triggerId,
      },
    },
    content: {
      role: 'region',
      'aria-labelledby': itemContext.triggerId,
      'data-orientation': accordionContext.orientation,
    },
    header: {
      'data-orientation': accordionContext.orientation,
      'data-state': getState(itemContext.open),
      'data-disabled': itemContext.disabled ? '' : undefined,
    },
    ItemProvider: AccordionItemContext.Provider,
    itemProviderValue: {
      open: itemContext.open,
      disabled: params.disabled,
      triggerId: params.value,
    },
    Collapsible,
    collapsibleProps: {
      'data-orientation': accordionContext.orientation,
      'data-state': open ? 'open' : 'closed',
      disabled,
      open,
      onOpenChange: (open) => {
        if (open) {
          valueContext.onItemOpen(value)
        } else {
          valueContext.onItemClose(value)
        }
      },
    },
  }
}
