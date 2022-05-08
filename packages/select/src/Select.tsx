import {
  ContextData,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
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
import { composeEventHandlers, useIsomorphicLayoutEffect } from '@tamagui/core'
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

//   upsides:
//     could virtualize in the future
//     should be a decent amount faster
//     no having to set keys
//     no internal awkward traversal of children, impossible on native

//   downsides:
//     have to have a hook with a new type of pattern

// alternate is just to require passing index={}

// const select = useSelect()
//
// <Select items={[]}>
//   <SelectTrigger>
//     <SelectIcon />
//     <SelectValue />
//   </SelectTrigger>
//
//   <SelectContent>
//     <SelectScrollUpButton />
//     <SelectScrollDownButton />
//
//     can optionally include group
//     <SelectItemGroup>
//       <SelectItemGroupLabel />
//     </SelectItemGroup>
//
//     <SelectItem>
//       <SelectItemText>
//          {select.text}
//       </SelectItemText>
//       <SelectItemIndicator />
//     </SelectItem>
//   </SelectItemGroup>
//
//   </SelectContent>
// </Select>

type GenericElement = HTMLElement | View

type Direction = 'ltr' | 'rtl'

const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
const SELECTION_KEYS = [' ', 'Enter']

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

const SELECT_NAME = 'Select'

const WINDOW_PADDING = 8
const SCROLL_ARROW_VELOCITY = 8
const SCROLL_ARROW_THRESHOLD = 8
const MIN_HEIGHT = 80
const FALLBACK_THRESHOLD = 16

interface SelectContextValue {
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
}

// type SelectContentContextValue = {
//   contentWrapper: HTMLDivElement | null
//   content: SelectContentElement | null
//   viewport: SelectViewportElement | null
//   onViewportChange(node: SelectViewportElement | null): void
//   selectedItem: SelectItemElement | null
//   onSelectedItemChange(node: SelectItemElement | null): void
//   selectedItemText: SelectItemTextElement | null
//   onSelectedItemTextChange(node: SelectItemTextElement | null): void
//   onScrollButtonChange(node: SelectScrollButtonImplElement | null): void
//   onItemLeave(): void
//   isPositioned: boolean
//   shouldExpandOnScrollRef: React.RefObject<boolean>
//   searchRef: React.RefObject<string>
// }

// const [SelectContentContextProvider, useSelectContentContext] =
//   createSelectContext<SelectContentContextValue>(CONTENT_NAME)

// const SelectContext = React.createContext({} as SelectContextValue)

type ScopedProps<P> = P & { __scopeSelect?: Scope }

const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME)
const [SelectProvider, useSelectContext] = createSelectContext<SelectContextValue>(SELECT_NAME)

interface SelectProps {
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

const Select: React.FC<SelectProps> = (props: ScopedProps<SelectProps>) => {
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

  // const listContentRef = useRef([
  //   "Select...",
  //   ...(Children.map(children, (child) =>
  //     Children.map(
  //       isValidElement(child) && child.props.children,
  //       (child) => child.props.value
  //     )
  //   ) ?? [])
  // ]);

  const selectedIndexRef = React.useRef<number | null>(null)
  const activeIndexRef = React.useRef<number | null>(null)
  const prevActiveIndex = usePrevious<number | null>(activeIndex)

  const [showArrows, setShowArrows] = React.useState(false)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(
    Math.max(0, listContentRef.current.indexOf(value))
  )

  useIsomorphicLayoutEffect(() => {
    selectedIndexRef.current = selectedIndex
    activeIndexRef.current = activeIndex
  })

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  useEffect(() => {
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

  const showUpArrow = showArrows && scrollTop > SCROLL_ARROW_THRESHOLD
  const showDownArrow =
    showArrows &&
    floatingRef.current &&
    scrollTop <
      floatingRef.current.scrollHeight - floatingRef.current.clientHeight - SCROLL_ARROW_THRESHOLD

  // We set this to true by default so that events bubble to forms without JS (SSR)
  // const isFormControl = trigger ? Boolean(trigger.closest('form')) : true
  // const [bubbleSelect, setBubbleSelect] = React.useState<HTMLSelectElement | null>(null)
  // const triggerPointerDownPosRef = React.useRef<{ x: number; y: number } | null>(null)

  return (
    <SelectProvider
      scope={__scopeSelect}
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
}

Select.displayName = SELECT_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SelectTrigger'

type SelectTriggerElement = GenericElement
type SelectTriggerProps = YStackProps

const SelectTrigger = React.forwardRef<SelectTriggerElement, SelectTriggerProps>(
  (props: ScopedProps<SelectTriggerProps>, forwardedRef) => {
    const {
      __scopeSelect,
      disabled = false,
      // @ts-ignore
      'aria-labelledby': ariaLabelledby,
      ...triggerProps
    } = props
    const context = useSelectContext(TRIGGER_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange)
    const getItems = useCollection(__scopeSelect)
    // const labelId = useLabelContext(context.trigger)
    // const labelledBy = ariaLabelledby || labelId

    // const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
    //   const enabledItems = getItems().filter((item) => !item.disabled)
    //   const currentItem = enabledItems.find((item) => item.value === context.value)
    //   const nextItem = findNextItem(enabledItems, search, currentItem)
    //   if (nextItem !== undefined) {
    //     context.onValueChange(nextItem.value)
    //   }
    // })

    const handleOpen = () => {
      if (!disabled) {
        context.onOpenChange(true)
        // reset typeahead when we open
        resetTypeahead()
      }
    }

    return (
      <Primitive.button
        type="button"
        role="combobox"
        aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-autocomplete="none"
        // aria-labelledby={labelledBy}
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={composedRefs}
        onPointerDown={composeEventHandlers(triggerProps.onPointerDown, (event) => {
          // prevent implicit pointer capture
          // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
          ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)

          // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
          // but not when the control key is pressed (avoiding MacOS right click)
          if (event.button === 0 && event.ctrlKey === false) {
            handleOpen()
            context.triggerPointerDownPosRef.current = {
              x: Math.round(event.pageX),
              y: Math.round(event.pageY),
            }
            // prevent trigger from stealing focus from the active item after opening.
            event.preventDefault()
          }
        })}
        onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== ''
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key)
          if (isTypingAhead && event.key === ' ') return
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen()
            event.preventDefault()
          }
        })}
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

const ICON_NAME = 'SelectIcon'

type SelectIconProps = YStackProps
type SelectIconElement = GenericElement

const SelectIcon = React.forwardRef<SelectIconElement, SelectIconProps>(
  (props: ScopedProps<SelectIconProps>, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props
    return (
      <XStack aria-hidden {...iconProps} ref={forwardedRef}>
        {children || '▼'}
      </XStack>
    )
  }
)

SelectIcon.displayName = ICON_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'SelectContent'

type SelectContentElement = any
type SelectContentProps = any

const SelectContent = React.forwardRef<SelectContentElement, SelectContentProps>(
  (props: ScopedProps<SelectContentProps>, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME, props.__scopeSelect)
    return props.children
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'SelectGroup'

type SelectGroupContextValue = { id: string }

const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<SelectGroupContextValue>(GROUP_NAME)

type SelectGroupElement = React.ElementRef<typeof Primitive.div>
interface SelectGroupProps extends PrimitiveDivProps {}

const SelectGroup = React.forwardRef<SelectGroupElement, SelectGroupProps>(
  (props: ScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const groupId = useId()
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId}>
        <Primitive.div role="group" aria-labelledby={groupId} {...groupProps} ref={forwardedRef} />
      </SelectGroupContextProvider>
    )
  }
)

SelectGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'SelectLabel'

type SelectLabelElement = React.ElementRef<typeof Primitive.div>
interface SelectLabelProps extends PrimitiveDivProps {}

const SelectLabel = React.forwardRef<SelectLabelElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)
    return <Primitive.div id={groupContext.id} {...labelProps} ref={forwardedRef} />
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
  onItemTextChange(node: SelectItemTextElement | null): void
}

const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME)

type SelectItemElement = React.ElementRef<typeof Primitive.div>
interface SelectItemProps extends PrimitiveDivProps {
  value: string
  disabled?: boolean
  textValue?: string
}

const SelectItem = React.forwardRef<SelectItemElement, SelectItemProps>(
  (props: ScopedProps<SelectItemProps>, forwardedRef) => {
    const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props
    const context = useSelectContext(ITEM_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect)
    const isSelected = context.value === value
    const [textValue, setTextValue] = React.useState(textValueProp ?? '')
    const [isFocused, setIsFocused] = React.useState(false)
    const composedRefs = useComposedRefs(
      forwardedRef,
      isSelected ? contentContext.onSelectedItemChange : undefined
    )
    const textId = useId()

    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value)
        context.onOpenChange(false)
      }
    }

    return (
      <SelectItemContextProvider
        scope={__scopeSelect}
        value={value}
        textId={textId}
        isSelected={isSelected}
        onItemTextChange={React.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? '').trim())
        }, [])}
      >
        <Collection.ItemSlot
          scope={__scopeSelect}
          value={value}
          disabled={disabled}
          textValue={textValue}
        >
          <Primitive.div
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
            onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
            onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
            onPointerUp={composeEventHandlers(itemProps.onPointerUp, handleSelect)}
            onPointerMove={composeEventHandlers(itemProps.onPointerMove, (event) => {
              if (disabled) {
                contentContext.onItemLeave()
              } else {
                // even though safari doesn't support this option, it's acceptable
                // as it only means it might scroll a few pixels when using the pointer.
                event.currentTarget.focus({ preventScroll: true })
              }
            })}
            onPointerLeave={composeEventHandlers(itemProps.onPointerLeave, (event) => {
              if (event.currentTarget === document.activeElement) {
                contentContext.onItemLeave()
              }
            })}
            onKeyDown={composeEventHandlers(itemProps.onKeyDown, (event) => {
              const isTypingAhead = contentContext.searchRef.current !== ''
              if (isTypingAhead && event.key === ' ') return
              if (SELECTION_KEYS.includes(event.key)) handleSelect()
              // prevent page scroll if using the space key to select an item
              if (event.key === ' ') event.preventDefault()
            })}
          />
        </Collection.ItemSlot>
      </SelectItemContextProvider>
    )
  }
)

SelectItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TEXT_NAME = 'SelectItemText'

type SelectItemTextElement = React.ElementRef<typeof Primitive.span>
interface SelectItemTextProps extends PrimitiveSpanProps {}

const SelectItemText = React.forwardRef<SelectItemTextElement, SelectItemTextProps>(
  (props: ScopedProps<SelectItemTextProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...itemTextProps } = props
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect)
    const ref = React.useRef<SelectItemTextElement | null>(null)
    const composedRefs = useComposedRefs(
      forwardedRef,
      ref,
      itemContext.onItemTextChange,
      itemContext.isSelected ? contentContext.onSelectedItemTextChange : undefined
    )

    return (
      <>
        <Primitive.span id={itemContext.textId} {...itemTextProps} ref={composedRefs} />

        {/* Portal the select item text into the trigger value node */}
        {itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode)
          : null}

        {/* Portal an option in the bubble select */}
        {context.bubbleSelect
          ? ReactDOM.createPortal(
              // we use `.textContent` because `option` only support `string` or `number`
              <option value={itemContext.value}>{ref.current?.textContent}</option>,
              context.bubbleSelect
            )
          : null}
      </>
    )
  }
)

SelectItemText.displayName = ITEM_TEXT_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'SelectItemIndicator'

type SelectItemIndicatorElement = React.ElementRef<typeof Primitive.span>
interface SelectItemIndicatorProps extends PrimitiveSpanProps {}

const SelectItemIndicator = React.forwardRef<SelectItemIndicatorElement, SelectItemIndicatorProps>(
  (props: ScopedProps<SelectItemIndicatorProps>, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect)
    return itemContext.isSelected ? (
      <Primitive.span aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
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
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect)
  const [canScrollUp, setCanScrollUp] = React.useState(false)
  const composedRefs = useComposedRefs(forwardedRef, contentContext.onScrollButtonChange)

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

  return canScrollUp ? (
    <SelectScrollButtonImpl
      {...props}
      ref={composedRefs}
      onAutoScroll={() => {
        const { viewport, selectedItem } = contentContext
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight
        }
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
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect)
  const [canScrollDown, setCanScrollDown] = React.useState(false)
  const composedRefs = useComposedRefs(forwardedRef, contentContext.onScrollButtonChange)

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
        const { viewport, selectedItem } = contentContext
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight
        }
      }}
    />
  ) : null
})

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME

type SelectScrollButtonImplElement = React.ElementRef<typeof Primitive.div>
interface SelectScrollButtonImplProps extends PrimitiveDivProps {
  onAutoScroll(): void
}

const SelectScrollButtonImpl = React.forwardRef<
  SelectScrollButtonImplElement,
  SelectScrollButtonImplProps
>((props: ScopedProps<SelectScrollButtonImplProps>, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props
  const contentContext = useSelectContentContext('SelectScrollButton', __scopeSelect)
  const autoScrollTimerRef = React.useRef<number | null>(null)

  const intervalRef = React.useRef<any>()
  const loopingRef = React.useRef(false)

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: dir === 'up' ? 'top' : 'bottom',
    middleware: [offset(({ floating }) => -floating.height)],
  })

  return (
    <Primitive.div
      aria-hidden
      {...scrollIndicatorProps}
      ref={forwardedRef}
      style={{ flexShrink: 0, ...scrollIndicatorProps.style }}
      onPointerMove={composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        contentContext.onItemLeave()
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50)
        }
      })}
      onPointerLeave={composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer()
      })}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

const SEPARATOR_NAME = 'SelectSeparator'

type SelectSeparatorElement = React.ElementRef<typeof Primitive.div>
interface SelectSeparatorProps extends PrimitiveDivProps {}

const SelectSeparator = Separator
// React.forwardRef<SelectSeparatorElement, SelectSeparatorProps>(
//   (props: ScopedProps<SelectSeparatorProps>, forwardedRef) => {
//     const { __scopeSelect, ...separatorProps } = props
//     return <Primitive.div aria-hidden {...separatorProps} ref={forwardedRef} />
//   }
// )

SelectSeparator.displayName = SEPARATOR_NAME

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
    return (
      <VisuallyHidden asChild>
        <select {...selectProps} ref={composedRefs} defaultValue={value} />
      </VisuallyHidden>
    )
  }
)

// const Root = Select
// const Trigger = SelectTrigger
// const Value = SelectValue
// const Icon = SelectIcon
// const Content = SelectContent
// const Viewport = SelectViewport
// const Group = SelectGroup
// const Label = SelectLabel
// const Item = SelectItem
// const ItemText = SelectItemText
// const ItemIndicator = SelectItemIndicator
// const ScrollUpButton = SelectScrollUpButton
// const ScrollDownButton = SelectScrollDownButton
// const Separator = SelectSeparator

export {
  createSelectScope,
  //
  Select,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  // SelectViewport,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
  //
  // Root,
  // Trigger,
  // Value,
  // Icon,
  // Content,
  // Viewport,
  // Group,
  // Label,
  // Item,
  // ItemText,
  // ItemIndicator,
  // ScrollUpButton,
  // ScrollDownButton,
  // Separator,
}
export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIconProps,
  SelectContentProps,
  SelectViewportProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectItemProps,
  SelectItemTextProps,
  SelectItemIndicatorProps,
  SelectScrollUpButtonProps,
  SelectScrollDownButtonProps,
  SelectSeparatorProps,
}
