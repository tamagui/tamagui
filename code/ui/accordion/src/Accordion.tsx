import { Collapsible } from '@tamagui/collapsible'
import { createCollection } from '@tamagui/collection'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { YStack } from '@tamagui/stacks'
import type { H3 } from '@tamagui/text'
import { H1 } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import type { GetProps, GetRef, Stack, TamaguiElement } from '@tamagui/web'
import { View, useEvent } from '@tamagui/web'
import { createStyledContext, styled } from '@tamagui/web'
import * as React from 'react'

type Direction = 'ltr' | 'rtl'

/* -------------------------------------------------------------------------------------------------
 * Accordion
 * -----------------------------------------------------------------------------------------------*/

const ACCORDION_NAME = 'Accordion'
const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']

const [Collection, useCollection] = createCollection<AccordionTrigger>(ACCORDION_NAME)

type ScopedProps<P> = P & { __scopeAccordion?: string }

type AccordionElement = AccordionImplMultipleElement | AccordionImplSingleElement
interface AccordionSingleProps extends AccordionImplSingleProps {
  type: 'single'
}
interface AccordionMultipleProps extends AccordionImplMultipleProps {
  type: 'multiple'
}

const ACCORDION_CONTEXT = 'Accordion'

const AccordionComponent = React.forwardRef<
  AccordionElement,
  ScopedProps<AccordionSingleProps | AccordionMultipleProps>
>((props: ScopedProps<AccordionSingleProps | AccordionMultipleProps>, forwardedRef) => {
  const { type, ...accordionProps } = props
  const singleProps = accordionProps as AccordionImplSingleProps
  const multipleProps = accordionProps as AccordionImplMultipleProps

  return (
    <Collection.Provider __scopeCollection={props.__scopeAccordion || ACCORDION_CONTEXT}>
      {type === 'multiple' ? (
        <AccordionImplMultiple {...multipleProps} ref={forwardedRef} />
      ) : (
        <AccordionImplSingle {...singleProps} ref={forwardedRef} />
      )}
    </Collection.Provider>
  )
})

AccordionComponent.displayName = ACCORDION_NAME

AccordionComponent.propTypes = {
  type(props) {
    const value = props.value || props.defaultValue
    if (props.type && !['single', 'multiple'].includes(props.type)) {
      return new Error(
        'Invalid prop `type` supplied to `Accordion`. Expected one of `single | multiple`.'
      )
    }
    if (props.type === 'multiple' && typeof value === 'string') {
      return new Error(
        'Invalid prop `type` supplied to `Accordion`. Expected `single` when `defaultValue` or `value` is type `string`.'
      )
    }
    if (props.type === 'single' && Array.isArray(value)) {
      return new Error(
        'Invalid prop `type` supplied to `Accordion`. Expected `multiple` when `defaultValue` or `value` is type `string[]`.'
      )
    }
    return null
  },
}

/* -----------------------------------------------------------------------------------------------*/

type AccordionValueContextValue = {
  value: string[]
  onItemOpen(value: string): void
  onItemClose(value: string): void
}

const { Provider: AccordionValueProvider, useStyledContext: useAccordionValueContext } =
  createStyledContext<AccordionValueContextValue>()

const {
  Provider: AccordionCollapsibleProvider,
  useStyledContext: useAccordionCollapsibleContext,
} = createStyledContext()

type AccordionImplSingleElement = AccordionImplElement

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

const AccordionImplSingle = React.forwardRef<
  AccordionImplSingleElement,
  ScopedProps<AccordionImplSingleProps>
>((props: ScopedProps<AccordionImplSingleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    control,
    onValueChange = () => {},
    collapsible = false,
    ...accordionSingleProps
  } = props

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue || '',
    onChange: onValueChange,
  })

  return (
    <AccordionValueProvider
      scope={props.__scopeAccordion}
      value={value ? [value] : []}
      onItemOpen={setValue}
      onItemClose={React.useCallback(
        () => collapsible && setValue(''),
        [setValue, collapsible]
      )}
    >
      <AccordionCollapsibleProvider
        scope={props.__scopeAccordion}
        collapsible={collapsible}
      >
        <AccordionImpl {...accordionSingleProps} ref={forwardedRef} />
      </AccordionCollapsibleProvider>
    </AccordionValueProvider>
  )
})

/* -----------------------------------------------------------------------------------------------*/
type AccordionImplMultipleElement = AccordionImplElement
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

const AccordionImplMultiple = React.forwardRef<
  AccordionImplMultipleElement,
  ScopedProps<AccordionImplMultipleProps>
>((props: ScopedProps<AccordionImplMultipleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...accordionMultipleProps
  } = props

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

  return (
    <AccordionValueProvider
      scope={props.__scopeAccordion}
      value={value || []}
      onItemOpen={handleItemOpen}
      onItemClose={handleItemClose}
    >
      <AccordionCollapsibleProvider scope={props.__scopeAccordion} collapsible={true}>
        <AccordionImpl {...accordionMultipleProps} ref={forwardedRef} />
      </AccordionCollapsibleProvider>
    </AccordionValueProvider>
  )
})

/* -----------------------------------------------------------------------------------------------*/

type AccordionImplContextValue = {
  disabled?: boolean
  direction: AccordionImplProps['dir']
  orientation: AccordionImplProps['orientation']
}

const { Provider: AccordionImplProvider, useStyledContext: useAccordionContext } =
  createStyledContext<AccordionImplContextValue>()

type AccordionImplElement = TamaguiElement
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

const AccordionImpl = React.forwardRef<AccordionImplElement, AccordionImplProps>(
  (props: ScopedProps<AccordionImplProps>, forwardedRef) => {
    const {
      __scopeAccordion,
      disabled,
      dir,
      orientation = 'vertical',
      ...accordionProps
    } = props

    const accordionRef = React.useRef<AccordionImplElement>(null)
    const composedRef = useComposedRefs(accordionRef, forwardedRef)
    const getItems = useCollection(__scopeAccordion || ACCORDION_CONTEXT)
    const direction = useDirection(dir)
    const isDirectionLTR = direction === 'ltr'
    const handleKeyDown = composeEventHandlers(
      (props as any).onKeyDown,
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

    return (
      <AccordionImplProvider
        scope={__scopeAccordion}
        disabled={disabled}
        direction={dir}
        orientation={orientation}
      >
        <Collection.Slot __scopeCollection={__scopeAccordion || ACCORDION_CONTEXT}>
          <YStack
            data-orientation={orientation}
            ref={composedRef}
            {...accordionProps}
            {...(isWeb && {
              onKeyDown: handleKeyDown,
            })}
          />
        </Collection.Slot>
      </AccordionImplProvider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'AccordionItem'

type AccordionItemContextValue = { open?: boolean; disabled?: boolean; triggerId: string }
const { Provider: AccordionItemProvider, useStyledContext: useAccordionItemContext } =
  createStyledContext<AccordionItemContextValue>()
type AccordionItemElement = React.ElementRef<typeof Collapsible>
type CollapsibleProps = React.ComponentPropsWithoutRef<typeof Collapsible>
interface AccordionItemProps
  extends Omit<CollapsibleProps, 'open' | 'defaultOpen' | 'onOpenChange'> {
  /**
   * Whether or not an accordion item is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * A string value for the accordion item. All items within an accordion should use a unique value.
   */
  value: string
}

/**
 * `AccordionItem` contains all of the parts of a collapsible section inside of an `Accordion`.
 */

const AccordionItem = React.forwardRef<AccordionItemElement, AccordionItemProps>(
  (props: ScopedProps<AccordionItemProps>, forwardedRef) => {
    const { __scopeAccordion, value, ...accordionItemProps } = props
    const accordionContext = useAccordionContext(__scopeAccordion)
    const valueContext = useAccordionValueContext(__scopeAccordion)
    const triggerId = React.useId()
    const open = (value && valueContext.value.includes(value)) || false
    const disabled = accordionContext.disabled || props.disabled

    return (
      <AccordionItemProvider
        scope={__scopeAccordion}
        open={open}
        disabled={disabled}
        triggerId={triggerId}
      >
        <Collapsible
          data-orientation={accordionContext.orientation}
          data-state={open ? 'open' : 'closed'}
          __scopeCollapsible={__scopeAccordion || ACCORDION_CONTEXT}
          {...accordionItemProps}
          ref={forwardedRef}
          disabled={disabled}
          open={open}
          onOpenChange={(open) => {
            if (open) {
              valueContext.onItemOpen(value)
            } else {
              valueContext.onItemClose(value)
            }
          }}
        />
      </AccordionItemProvider>
    )
  }
)

AccordionItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'AccordionHeader'

type AccordionHeaderElement = React.ElementRef<typeof H3>
type PrimitiveHeading3Props = React.ComponentPropsWithoutRef<typeof H3>
type AccordionHeaderProps = PrimitiveHeading3Props

/**
 * `AccordionHeader` contains the content for the parts of an `AccordionItem` that will be visible
 * whether or not its content is collapsed.
 */
const AccordionHeader = React.forwardRef<AccordionHeaderElement, AccordionHeaderProps>(
  (props: ScopedProps<AccordionHeaderProps>, forwardedRef) => {
    const { __scopeAccordion, ...headerProps } = props
    const accordionContext = useAccordionContext(__scopeAccordion)
    const itemContext = useAccordionItemContext(__scopeAccordion)
    return (
      <H1
        data-orientation={accordionContext.orientation}
        data-state={getState(itemContext.open)}
        data-disabled={itemContext.disabled ? '' : undefined}
        {...headerProps}
        ref={forwardedRef}
      />
    )
  }
)

AccordionHeader.displayName = HEADER_NAME

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/

const AccordionTriggerFrame = styled(Collapsible.Trigger, {
  variants: {
    unstyled: {
      false: {
        cursor: 'pointer',
        backgroundColor: '$background',
        borderColor: '$borderColor',
        borderWidth: 1,
        padding: '$true',

        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },

        focusStyle: {
          backgroundColor: '$backgroundFocus',
        },

        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type AccordionTrigger = GetRef<typeof AccordionTriggerFrame>
type AccordionTriggerProps = GetProps<typeof AccordionTriggerFrame>

/**
 * `AccordionTrigger` is the trigger that toggles the collapsed state of an `AccordionItem`. It
 * should always be nested inside of an `AccordionHeader`.
 */
const AccordionTrigger = AccordionTriggerFrame.styleable(function AccordionTrigger(
  props: ScopedProps<AccordionTriggerProps>,
  forwardedRef
) {
  const { __scopeAccordion, ...triggerProps } = props
  const accordionContext = useAccordionContext(__scopeAccordion)
  const itemContext = useAccordionItemContext(__scopeAccordion)
  const collapsibleContext = useAccordionCollapsibleContext(__scopeAccordion)

  return (
    <Collection.ItemSlot __scopeCollection={__scopeAccordion || ACCORDION_CONTEXT}>
      <AccordionTriggerFrame
        //   @ts-ignore
        __scopeCollapsible={__scopeAccordion || ACCORDION_CONTEXT}
        aria-disabled={(itemContext.open && !collapsibleContext.collapsible) || undefined}
        data-orientation={accordionContext.orientation}
        id={itemContext.triggerId}
        {...triggerProps}
        ref={forwardedRef}
      />
    </Collection.ItemSlot>
  )
})

/* -------------------------------------------------------------------------------------------------
 * AccordionContent
 * -----------------------------------------------------------------------------------------------*/

const AccordionContentFrame = styled(Collapsible.Content, {
  variants: {
    unstyled: {
      false: {
        padding: '$true',
        backgroundColor: '$background',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type AccordionContentProps = GetProps<typeof AccordionContentFrame>

/**
 * `AccordionContent` contains the collapsible content for an `AccordionItem`.
 */
const AccordionContent = AccordionContentFrame.styleable(function AccordionContent(
  props: ScopedProps<AccordionContentProps>,
  forwardedRef
) {
  const { __scopeAccordion, ...contentProps } = props
  const accordionContext = useAccordionContext(__scopeAccordion)
  const itemContext = useAccordionItemContext(__scopeAccordion)
  return (
    <AccordionContentFrame
      role="region"
      aria-labelledby={itemContext.triggerId}
      data-orientation={accordionContext.orientation}
      // @ts-ignore
      __scopeCollapsible={__scopeAccordion || ACCORDION_CONTEXT}
      {...contentProps}
      ref={forwardedRef}
    />
  )
})

const HeightAnimator = View.styleable((props, ref) => {
  const itemContext = useAccordionItemContext()
  const { children, ...rest } = props
  const [height, setHeight] = React.useState(0)

  const onLayout = useEvent(({ nativeEvent }) => {
    if (nativeEvent.layout.height) {
      setHeight(nativeEvent.layout.height)
    }
  })

  return (
    <View ref={ref} height={itemContext.open ? height : 0} {...rest}>
      <View
        position="absolute"
        width="100%"
        //@ts-ignore
        onLayout={onLayout}
      >
        {children}
      </View>
    </View>
  )
})

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? 'open' : 'closed'
}
const Accordion = withStaticProperties(AccordionComponent, {
  Trigger: AccordionTrigger,
  Header: AccordionHeader,
  Content: AccordionContent,
  Item: AccordionItem,
  HeightAnimator: HeightAnimator,
})

export { Accordion }

export type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionSingleProps,
  AccordionTriggerProps,
}
