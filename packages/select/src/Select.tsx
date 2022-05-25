import {
  ContextData,
  FloatingContext,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  ReferenceType,
  autoUpdate,
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
import { useCallbackRef } from '@radix-ui/react-use-callback-ref'
import { usePrevious } from '@radix-ui/react-use-previous'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Text,
  composeEventHandlers,
  styled,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
// import { useDirection } from '@tamagui/react-direction'
// import { DismissableLayer } from '@tamagui/react-dismissable-layer'
// import { FocusScope } from '@tamagui/react-focus-scope'
import { useId } from '@tamagui/core'
import { createContextScope } from '@tamagui/create-context'
import type { Scope } from '@tamagui/create-context'
import { clamp } from '@tamagui/helpers'
// import { useLabelContext } from '@tamagui/react-label'
import { Portal } from '@tamagui/portal'
import { Separator } from '@tamagui/separator'
import { XStack, YStack, YStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
// import { Primitive } from '@tamagui/react-primitive'
// import type * as Radix from '@tamagui/react-primitive'
import { useControllableState } from '@tamagui/use-controllable-state'
// import { useLayoutEffect } from '@tamagui/react-use-layout-effect'
// import { usePrevious } from '@tamagui/react-use-previous'
// import { VisuallyHidden } from '@tamagui/core'
// import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { View } from 'react-native'

// import { RemoveScroll } from 'react-remove-scroll'

type TamaguiElement = HTMLElement | View

/* -------------------------------------------------------------------------------------------------
 * SelectContext
 * -----------------------------------------------------------------------------------------------*/

const SELECT_NAME = 'Select'
const WINDOW_PADDING = 8
const SCROLL_ARROW_VELOCITY = 8
const SCROLL_ARROW_THRESHOLD = 8
const MIN_HEIGHT = 80
const FALLBACK_THRESHOLD = 16

interface SelectContextValue {
  value: any
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  listRef: React.MutableRefObject<Array<HTMLLIElement | null>>
  open: boolean
  setOpen: (open: boolean) => void
  onChange: (value: string) => void
  dataRef: React.MutableRefObject<ContextData>
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => any
  controlledScrolling: boolean
  canScrollUp: boolean
  canScrollDown: boolean
  floatingContext: FloatingContext<ReferenceType>
  interactions: {
    getReferenceProps: (userProps?: React.HTMLProps<Element> | undefined) => any
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => any
    getItemProps: (userProps?: React.HTMLProps<HTMLElement> | undefined) => any
  }

  // gather elements
  setElement(
    type:
      | 'trigger'
      | 'triggerIcon'
      | 'triggerValue'
      | 'content'
      | 'scrollUp'
      | 'scrollDown'
      | 'group'
      | 'groupLabel'
      | 'item'
      | 'itemText'
      | 'itemIndicator',
    value: React.ReactElement
  ): void
}

type ScopedProps<P> = P & { __scopeSelect?: Scope }

const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME)
const [SelectProvider, useSelectContext] = createSelectContext<SelectContextValue>(SELECT_NAME)

// const [SelectContentContextProvider, useSelectContentContext] =
//   createSelectContext<SelectContentContextValue>(CONTENT_NAME);

type GenericElement = HTMLElement | View

type Direction = 'ltr' | 'rtl'

const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
const SELECTION_KEYS = [' ', 'Enter']

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SelectTrigger'

export type SelectTriggerProps = YStackProps

export const SelectTrigger = React.forwardRef<GenericElement, SelectTriggerProps>(
  (props: ScopedProps<SelectTriggerProps>, forwardedRef) => {
    const {
      __scopeSelect,
      disabled = false,
      // @ts-ignore
      'aria-labelledby': ariaLabelledby,
      ...triggerProps
    } = props
    const context = useSelectContext(TRIGGER_NAME, __scopeSelect)
    // const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange)
    // const getItems = useCollection(__scopeSelect)
    // const labelId = useLabelContext(context.trigger)
    // const labelledBy = ariaLabelledby || labelId

    return (
      <YStack
        tag="button"
        // role="combobox"
        // aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-autocomplete="none"
        // aria-labelledby={labelledBy}
        // dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={forwardedRef}
        // onPointerDown={composeEventHandlers(triggerProps.onPointerDown, (event) => {
        //   // prevent implicit pointer capture
        //   // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
        //   ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)

        //   // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        //   // but not when the control key is pressed (avoiding MacOS right click)
        //   if (event.button === 0 && event.ctrlKey === false) {
        //     handleOpen()
        //     context.triggerPointerDownPosRef.current = {
        //       x: Math.round(event.pageX),
        //       y: Math.round(event.pageY),
        //     }
        //     // prevent trigger from stealing focus from the active item after opening.
        //     event.preventDefault()
        //   }
        // })}
        // onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event) => {
        //   const isTypingAhead = searchRef.current !== ''
        //   const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
        //   if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key)
        //   if (isTypingAhead && event.key === ' ') return
        //   if (OPEN_KEYS.includes(event.key)) {
        //     handleOpen()
        //     event.preventDefault()
        //   }
        // })}
      />
    )
  }
)

SelectTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue'

type SelectValueElement = GenericElement
type SelectValueProps = YStackProps

const SelectValue = React.forwardRef<SelectValueElement, SelectValueProps>(
  (props: ScopedProps<SelectValueProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...valueProps } = props
    // const context = useSelectContext(VALUE_NAME, __scopeSelect)
    // const { onValueNodeHasChildrenChange } = context
    // const hasChildren = props.children !== undefined
    // const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange)

    // React.useEffect(() => {
    //   onValueNodeHasChildrenChange(hasChildren)
    // }, [onValueNodeHasChildrenChange, hasChildren])

    return (
      <XStack
        {...valueProps}
        // ref={composedRefs}
        // we don't want events from the portalled `SelectValue` children to bubble
        // through the item they came from
        pointerEvents="none"
      />
    )
  }
)

// SelectValue.displayName = VALUE_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectIcon
 * -----------------------------------------------------------------------------------------------*/

export const SelectIcon = styled(XStack, {
  name: 'SelectIcon',
  // @ts-ignore
  'aria-hidden': true,
  children: '▼',
})

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectContent'

type SelectContentElement = any
type SelectContentProps = any

const SelectContent = React.forwardRef<SelectContentElement, SelectContentProps>(
  ({ children, __scopeSelect }: ScopedProps<SelectContentProps>, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME, __scopeSelect)
    return (
      <FloatingPortal>
        {context.open && <FloatingOverlay lockScroll>{children}</FloatingOverlay>}
      </FloatingPortal>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'SelectViewport'

export const SelectViewportFrame = styled(YStack, {
  name: VIEWPORT_NAME,
})

export type SelectViewportProps = GetProps<typeof SelectViewportFrame>

const SelectViewport = React.forwardRef<TamaguiElement, SelectViewportProps>(
  (props: ScopedProps<SelectViewportProps>, forwardedRef) => {
    const { __scopeSelect, children, ...viewportProps } = props
    const context = useSelectContext(VIEWPORT_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(
      forwardedRef
      // contentContext.onViewportChange
    )
    const prevScrollTopRef = React.useRef(0)
    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`,
          }}
        />
        <FloatingFocusManager context={context.floatingContext} preventTabbing>
          <SelectViewportFrame
            data-radix-select-viewport=""
            // @ts-ignore
            role="presentation"
            {...viewportProps}
            ref={composedRefs}
          >
            <div {...context.interactions.getFloatingProps()}>{children}</div>
          </SelectViewportFrame>
        </FloatingFocusManager>
      </>
    )
  }
)

SelectViewport.displayName = VIEWPORT_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'SelectGroup'

type SelectGroupContextValue = { id: string }

const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<SelectGroupContextValue>(GROUP_NAME)

const SelectGroupFrame = styled(YStack, {
  name: GROUP_NAME,
})

type SelectGroupProps = GetProps<typeof SelectGroupFrame>

const SelectGroup = React.forwardRef<TamaguiElement, SelectGroupProps>(
  (props: ScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const groupId = useId()
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId || ''}>
        <SelectGroupFrame
          // @ts-ignore
          role="group"
          aria-labelledby={groupId}
          {...groupProps}
          ref={forwardedRef}
        />
      </SelectGroupContextProvider>
    )
  }
)

SelectGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'SelectLabel'

type SelectLabelElement = TamaguiElement
interface SelectLabelProps extends YStackProps {}

const SelectLabel = React.forwardRef<SelectLabelElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)
    return <YStack id={groupContext.id} {...labelProps} ref={forwardedRef} />
  }
)

SelectLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem'

type SelectItemContextValue = {
  value: string
  textId: string
  isSelected: boolean
  onItemTextChange(node: TamaguiElement | null): void
}

const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME)

type SelectItemElement = TamaguiElement
interface SelectItemProps extends YStackProps {
  value: string
  disabled?: boolean
  textValue?: string
}

const SelectItem = React.forwardRef<SelectItemElement, SelectItemProps>(
  (props: ScopedProps<SelectItemProps>, forwardedRef) => {
    const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props
    const context = useSelectContext(ITEM_NAME, __scopeSelect)
    // const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect)
    const isSelected = context.value === value
    const [textValue, setTextValue] = React.useState(textValueProp ?? '')
    const [isFocused, setIsFocused] = React.useState(false)
    const composedRefs = useComposedRefs(
      forwardedRef
      // isSelected ? context.onSelectedItemChange : undefined
    )
    const textId = useId()

    const handleSelect = () => {
      if (!disabled) {
        // context.onValueChange(value)
        // context.onOpenChange(false)
      }
    }

    return (
      <SelectItemContextProvider
        scope={__scopeSelect}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
        onItemTextChange={React.useCallback((node) => {
          // setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? '').trim())
        }, [])}
      >
        {/* <Collection.ItemSlot
          scope={__scopeSelect}
          value={value}
          disabled={disabled}
          textValue={textValue}
        > */}
        <YStack
          // @ts-ignore
          role="option"
          aria-labelledby={textId}
          // `isFocused` caveat fixes stuttering in VoiceOver
          aria-selected={isSelected && isFocused}
          data-state={isSelected ? 'active' : 'inactive'}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          tabIndex={disabled ? undefined : -1}
          {...itemProps}
          ref={composedRefs}
          // onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
          // onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
          // onPointerUp={composeEventHandlers(itemProps.onPointerUp, handleSelect)}
          // onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
          //   if (disabled) {
          //     contentContext.onItemLeave()
          //   } else {
          //     // even though safari doesn't support this option, it's acceptable
          //     // as it only means it might scroll a few pixels when using the pointer.
          //     event.currentTarget.focus({ preventScroll: true })
          //   }
          // })}
          // onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
          //   if (event.currentTarget === document.activeElement) {
          //     contentContext.onItemLeave()
          //   }
          // })}
          // onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
          //   const isTypingAhead = contentContext.searchRef.current !== ''
          //   if (isTypingAhead && event.key === ' ') return
          //   if (SELECTION_KEYS.includes(event.key)) handleSelect()
          //   // prevent page scroll if using the space key to select an item
          //   if (event.key === ' ') event.preventDefault()
          // })}
        />
        {/* </Collection.ItemSlot> */}
      </SelectItemContextProvider>
    )
  }
)

SelectItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TEXT_NAME = 'SelectItemText'

const SelectItemTextFrame = styled(Paragraph, {
  name: ITEM_TEXT_NAME,
})

type SelectItemTextProps = GetProps<typeof SelectItemTextFrame>

const SelectItemText = React.forwardRef<TamaguiElement, SelectItemTextProps>(
  (props: ScopedProps<SelectItemTextProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...itemTextProps } = props
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
    // const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect)
    const ref = React.useRef<TamaguiElement | null>(null)
    const composedRefs = useComposedRefs(
      forwardedRef,
      ref,
      itemContext.onItemTextChange
      // itemContext.isSelected ? contentContext.onSelectedItemTextChange : undefined
    )

    return (
      <>
        <SelectItemTextFrame id={itemContext.textId} {...itemTextProps} ref={composedRefs} />

        {/* Portal the select item text into the trigger value node */}
        {/* {itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode)
          : null} */}

        {/* Portal an option in the bubble select */}
        {/* {context.bubbleSelect
          ? ReactDOM.createPortal(
              // we use `.textContent` because `option` only support `string` or `number`
              <option value={itemContext.value}>{ref.current?.textContent}</option>,
              context.bubbleSelect
            )
          : null} */}
      </>
    )
  }
)

SelectItemText.displayName = ITEM_TEXT_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'SelectItemIndicator'

const SelectItemIndicatorFrame = styled(XStack, {
  name: ITEM_TEXT_NAME,
})

type SelectItemIndicatorProps = GetProps<typeof SelectItemIndicatorFrame>

const SelectItemIndicator = React.forwardRef<TamaguiElement, SelectItemIndicatorProps>(
  (props: ScopedProps<SelectItemIndicatorProps>, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect)
    return itemContext.isSelected ? (
      <SelectItemIndicatorFrame aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
    ) : null
  }
)

SelectItemIndicator.displayName = ITEM_INDICATOR_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectScrollUpButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_UP_BUTTON_NAME = 'SelectScrollUpButton'

type SelectScrollUpButtonElement = SelectScrollButtonImplElement
interface SelectScrollUpButtonProps extends Omit<SelectScrollButtonImplProps, 'onAutoScroll'> {}

const SelectScrollUpButton = React.forwardRef<
  SelectScrollUpButtonElement,
  SelectScrollUpButtonProps
>((props: ScopedProps<SelectScrollUpButtonProps>, forwardedRef) => {
  const context = useSelectContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect)
  const composedRefs = useComposedRefs(
    forwardedRef
    // contentContext.onScrollButtonChange
  )

  // useLayoutEffect(() => {
  //   if (contentContext.viewport && contentContext.isPositioned) {
  //     const viewport = contentContext.viewport
  //     function handleScroll() {
  //       const canScrollUp = viewport.scrollTop > 0
  //       setCanScrollUp(canScrollUp)
  //     }
  //     handleScroll()
  //     viewport.addEventListener('scroll', handleScroll)
  //     return () => viewport.removeEventListener('scroll', handleScroll)
  //   }
  // }, [contentContext.viewport, contentContext.isPositioned])

  return context.canScrollUp ? (
    <SelectScrollButtonImpl
      {...props}
      ref={composedRefs}
      onAutoScroll={() => {
        // const { viewport, selectedItem } = contentContext
        // if (viewport && selectedItem) {
        //   viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight
        // }
      }}
    />
  ) : null
})

SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectScrollDownButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_DOWN_BUTTON_NAME = 'SelectScrollDownButton'

type SelectScrollDownButtonElement = SelectScrollButtonImplElement
interface SelectScrollDownButtonProps extends Omit<SelectScrollButtonImplProps, 'onAutoScroll'> {}

const SelectScrollDownButton = React.forwardRef<
  SelectScrollDownButtonElement,
  SelectScrollDownButtonProps
>((props: ScopedProps<SelectScrollDownButtonProps>, forwardedRef) => {
  // const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect)
  const [canScrollDown, setCanScrollDown] = React.useState(false)
  const composedRefs = useComposedRefs(
    forwardedRef
    // contentContext.onScrollButtonChange
  )

  // useLayoutEffect(() => {
  //   if (contentContext.viewport && contentContext.isPositioned) {
  //     const viewport = contentContext.viewport
  //     function handleScroll() {
  //       const maxScroll = viewport.scrollHeight - viewport.clientHeight
  //       // we use Math.ceil here because if the UI is zoomed-in
  //       // `scrollTop` is not always reported as an integer
  //       const canScrollDown = Math.ceil(viewport.scrollTop) < maxScroll
  //       setCanScrollDown(canScrollDown)
  //     }
  //     handleScroll()
  //     viewport.addEventListener('scroll', handleScroll)
  //     return () => viewport.removeEventListener('scroll', handleScroll)
  //   }
  // }, [contentContext.viewport, contentContext.isPositioned])

  return canScrollDown ? (
    <SelectScrollButtonImpl
      {...props}
      ref={composedRefs}
      onAutoScroll={() => {
        // const { viewport, selectedItem } = contentContext
        // if (viewport && selectedItem) {
        //   viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight
        // }
      }}
    />
  ) : null
})

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME

type SelectScrollButtonImplElement = TamaguiElement
interface SelectScrollButtonImplProps extends YStackProps {
  onAutoScroll(): void
}

const SelectScrollButtonImpl = React.forwardRef<
  SelectScrollButtonImplElement,
  SelectScrollButtonImplProps
>((props: ScopedProps<SelectScrollButtonImplProps>, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props
  // const contentContext = useSelectContentContext('SelectScrollButton', __scopeSelect)
  const autoScrollTimerRef = React.useRef<number | null>(null)

  const intervalRef = React.useRef<any>()
  const loopingRef = React.useRef(false)

  const dir = 'up' //TODO
  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: dir === 'up' ? 'top' : 'bottom',
    middleware: [
      // @ts-ignore
      offset(({ floating }) => -floating.height),
    ],
  })

  return (
    <YStack
      aria-hidden
      {...scrollIndicatorProps}
      ref={forwardedRef}
      // style={{ flexShrink: 0, ...scrollIndicatorProps.style }}
      // onPointerMove={composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
      //   contentContext.onItemLeave()
      //   if (autoScrollTimerRef.current === null) {
      //     autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50)
      //   }
      // })}
      // onPointerLeave={composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
      //   clearAutoScrollTimer()
      // })}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

export const SelectSeparator = styled(Separator, {
  name: 'SelectSeparator',
})

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

export interface SelectProps {
  children?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  dir?: Direction
  name?: string
  autoComplete?: string
}

export const Select = withStaticProperties(
  (props: ScopedProps<SelectProps>) => {
    const {
      __scopeSelect,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      value: valueProp,
      defaultValue,
      onValueChange,
      dir,
      name,
      autoComplete,
    } = props

    // const [trigger, setTrigger] = React.useState<SelectTriggerElement | null>(null)
    // const [valueNode, setValueNode] = React.useState<SelectValueElement | null>(null)
    // const [valueNodeHasChildren, setValueNodeHasChildren] = React.useState(false)
    // const direction = useDirection(dir)

    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
    })

    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue || '',
      onChange: onValueChange,
    })

    const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
    const selectedIndexRef = React.useRef<number | null>(null)
    const activeIndexRef = React.useRef<number | null>(null)
    const prevActiveIndex = usePrevious<number | null>(activeIndex)

    const [showArrows, setShowArrows] = React.useState(false)
    const [scrollTop, setScrollTop] = React.useState(0)
    const listItemsRef = React.useRef<Array<HTMLLIElement | null>>([])
    const listContentRef = React.useRef([
      'Select...',
      ...(React.Children.map(children, (child) =>
        React.Children.map(
          React.isValidElement(child) && child.props.children,
          (child) => child.props.value
        )
      ) ?? []),
    ])

    const [selectedIndex, setSelectedIndex] = React.useState(
      Math.max(0, listContentRef.current.indexOf(value))
    )
    const [controlledScrolling, setControlledScrolling] = React.useState(false)
    const [middlewareType, setMiddlewareType] = React.useState<'align' | 'fallback'>('align')

    useIsomorphicLayoutEffect(() => {
      selectedIndexRef.current = selectedIndex
      activeIndexRef.current = activeIndex
    })

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
    }, [open])

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
                // Custom `size` that can handle the opposite direction of the
                // placement
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
    const forceUpdate = React.useReducer(() => ({}), {})[1]

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
        const visualMaxHeight = visualViewport.height - WINDOW_PADDING * 2

        if (
          amount < 0 &&
          selectedIndexRef.current != null &&
          Math.round(rectBottom) <
            Math.round(visualViewport.height + getVisualOffsetTop() - WINDOW_PADDING)
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
      [middlewareType]
    )

    const handleScrollArrowChange = (dir: 'up' | 'down') => () => {
      const floating = floatingRef.current
      const isUp = dir === 'up'
      if (floating) {
        const value = isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY
        const multi =
          (isUp && floating.scrollTop <= SCROLL_ARROW_THRESHOLD * 2) ||
          (!isUp &&
            floating.scrollTop >=
              floating.scrollHeight - floating.clientHeight - SCROLL_ARROW_THRESHOLD * 2)
            ? 2
            : 1
        floating.scrollTop += multi * (isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY)

        increaseHeight(floating, multi === 2 ? value * 2 : value)
        // Ensure derived data (scroll arrows) is fresh
        forceUpdate()
      }
    }

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
            (currentTarget?.offsetHeight ?? 0) - (visualViewport.height - WINDOW_PADDING * 2)
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
      [increaseHeight, forceUpdate]
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
          visualViewport.height + getVisualOffsetTop() - referenceRect.bottom < FALLBACK_THRESHOLD
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
    }, [open])

    let optionIndex = 0
    // const options = [
    //   <ul key="default">
    //     <Option value="default">Select...</Option>
    //   </ul>,
    //   ...(React.Children.map(
    //     children,
    //     (child) =>
    //       React.isValidElement(child) && (
    //         <ul
    //           key={child.props.label}
    //           role="group"
    //           aria-labelledby={`floating-ui-select-${child.props.label}`}
    //         >
    //           <li
    //             role="presentation"
    //             id={`floating-ui-select-${child.props.label}`}
    //             className="SelectGroupLabel"
    //             aria-hidden="true"
    //           >
    //             {child.props.label}
    //           </li>
    //           {React.Children.map(child.props.children, (child) =>
    //             React.cloneElement(child, { index: 1 + optionIndex++ })
    //           )}
    //         </ul>
    //       )
    //   ) ?? []),
    // ]

    // We set this to true by default so that events bubble to forms without JS (SSR)
    // const isFormControl = trigger ? Boolean(trigger.closest('form')) : true
    // const [bubbleSelect, setBubbleSelect] = React.useState<HTMLSelectElement | null>(null)
    // const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null)

    return (
      <SelectProvider
        scope={__scopeSelect}
        interactions={{
          ...interactions,
          getFloatingProps() {
            return {
              ref: floating,
              className: 'Select',
              style: {
                position: strategy,
                top: y ?? '',
                left: x ?? '',
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
            }
          },
        }}
        floatingContext={context}
        activeIndex={0}
        canScrollDown
        canScrollUp
        controlledScrolling
        dataRef={null as any}
        getItemProps={null as any}
        listRef={listItemsRef}
        onChange={null as any}
        selectedIndex={0}
        setActiveIndex={() => {}}
        setElement={() => {}}
        setOpen={() => {}}
        setSelectedIndex={() => {}}
        value=""
        // trigger={trigger}
        // onTriggerChange={setTrigger}
        // valueNode={valueNode}
        // onValueNodeChange={setValueNode}
        // valueNodeHasChildren={valueNodeHasChildren}
        // onValueNodeHasChildrenChange={setValueNodeHasChildren}
        // contentId={useId() || ''}
        // value={value}
        // onValueChange={setValue}
        open={open}
        // onOpenChange={setOpen}
        // TODO
        // dir={'rtl'} //direction}
        // bubbleSelect={bubbleSelect}
        // triggerPointerDownPosRef={triggerPointerDownPosRef}
      >
        {/* <Collection.Provider scope={__scopeSelect}>{children}</Collection.Provider> */}
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
  },
  {
    Content: SelectContent,
    Group: SelectGroup,
    Icon: SelectIcon,
    Item: SelectItem,
    ItemIndicator: SelectItemIndicator,
    ItemText: SelectItemText,
    Label: SelectLabel,
    ScrollDownButton: SelectScrollDownButton,
    ScrollUpButton: SelectScrollUpButton,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Viewport: SelectViewport,
  }
)

// @ts-ignore
Select.displayName = SELECT_NAME

/* -----------------------------------------------------------------------------------------------*/

const BubbleSelect = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<'select'>>(
  (props, forwardedRef) => {
    const { value, ...selectProps } = props
    const ref = React.useRef<HTMLSelectElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const prevValue = usePrevious(value)

    // Bubble value change to parents (e.g form change event)
    React.useEffect(() => {
      const select = ref.current!
      const selectProto = window.HTMLSelectElement.prototype
      const descriptor = Object.getOwnPropertyDescriptor(selectProto, 'value') as PropertyDescriptor
      const setValue = descriptor.set
      if (prevValue !== value && setValue) {
        const event = new Event('change', { bubbles: true })
        setValue.call(select, value)
        select.dispatchEvent(event)
      }
    }, [prevValue, value])

    /**
     * We purposefully use a `select` here to support form autofill as much
     * as possible.
     *
     * We purposefully do not add the `value` attribute here to allow the value
     * to be set programatically and bubble to any parent form `onChange` event.
     * Adding the `value` will cause React to consider the programatic
     * dispatch a duplicate and it will get swallowed.
     *
     * We use `VisuallyHidden` rather than `display: "none"` because Safari autofill
     * won't work otherwise.
     */
    // TODO
    return null
    // return (
    //   <VisuallyHidden asChild>
    //     <select {...selectProps} ref={composedRefs} defaultValue={value} />
    //   </VisuallyHidden>
    // )
  }
)

// Cross browser fixes for pinch-zooming/backdrop-filter 🙄
const isFirefox =
  typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox')
if (isFirefox) {
  document.body.classList.add('firefox')
}
function getVisualOffsetTop() {
  return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? visualViewport.offsetTop : 0
}

/**
 *
 *  <Select
 *    items={[{ name: '', value: '', groupId: '123' }]}
 *    groups={{ 123: { name: '' } }}
 *    groupKey="groupId"
 *  >
 *    <Select.Trigger>
 *      <Select.Icon />
 *      <Select.Value />
 *    </Select.Trigger>
 *
 *    <Select.Content>
 *      <Select.ScrollUpButton />
 *      <Select.ScrollDownButton />
 *
 *      can optionally include group
 *      <Select.Group>
 *        {(group, index) => (
 *          <Select.GroupLabel>
 *            {group.name}
 *          </Select.GroupLabel>
 *        )}
 *      </Select.Group>
 *
 *      <Select.Item>
 *        {(item, index) => (
 *          <>
 *            <Select.ItemText>
 *              {item.text}
 *            </Select.ItemText>
 *            <Select.ItemIndicator />
 *          </>
 *        )}
 *      </Select.Item>
 *    </Select.Content>
 *  </Select>
 */
