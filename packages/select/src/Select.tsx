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
import { Button, ButtonProps } from '@tamagui/button'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  SizeTokens,
  Text,
  VariantSpreadExtras,
  VariantSpreadFunction,
  composeEventHandlers,
  getVariableValue,
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
import { ThemeableStack, XStack, YStack, YStackProps } from '@tamagui/stacks'
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

// Cross browser fixes for pinch-zooming/backdrop-filter 🙄
const isFirefox =
  typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox')
if (isFirefox) {
  document.body.classList.add('firefox')
}
function getVisualOffsetTop() {
  return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? visualViewport.offsetTop : 0
}

const getSelectItemSize = (val: SizeTokens, { tokens }: VariantSpreadExtras<any>) => {
  const padding = getVariableValue(tokens.size[val])
  return {
    paddingHorizontal: padding / 2,
    paddingVertical: padding / 4,
  }
}

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
  floatingRef: React.MutableRefObject<HTMLElement | null>
  open: boolean
  setOpen: (open: boolean) => void
  onChange: (value: string) => void
  dataRef: React.MutableRefObject<ContextData>
  controlledScrolling: boolean
  valueNode: Element | null
  onValueNodeChange(node: HTMLElement): void
  valueNodeHasChildren: boolean
  onValueNodeHasChildrenChange(hasChildren: boolean): void
  canScrollUp: boolean
  canScrollDown: boolean
  floatingContext: FloatingContext<ReferenceType>
  increaseHeight: (floating: HTMLElement, amount?: any) => number | undefined
  forceUpdate: React.DispatchWithoutAction
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

export type SelectTriggerProps = ButtonProps

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
      <Button
        componentName={TRIGGER_NAME}
        // aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-autocomplete="none"
        // aria-labelledby={labelledBy}
        // dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={forwardedRef}
        {...context.interactions.getReferenceProps()}
      />
    )
  }
)

SelectTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue'

const SelectValueFrame = styled(Paragraph, {
  name: VALUE_NAME,
})

type SelectValueProps = GetProps<typeof SelectValueFrame> & {
  placeholder?: React.ReactNode
}

const SelectValue = SelectValueFrame.extractable(
  React.forwardRef<TamaguiElement, SelectValueProps>(
    ({ __scopeSelect, children, placeholder }: ScopedProps<SelectValueProps>, forwardedRef) => {
      // We ignore `className` and `style` as this part shouldn't be styled.
      const context = useSelectContext(VALUE_NAME, __scopeSelect)
      const { onValueNodeHasChildrenChange } = context
      const hasChildren = children !== undefined
      const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange)

      React.useLayoutEffect(() => {
        onValueNodeHasChildrenChange(hasChildren)
      }, [onValueNodeHasChildrenChange, hasChildren])

      return (
        <SelectValueFrame
          ref={composedRefs}
          // we don't want events from the portalled `SelectValue` children to bubble
          // through the item they came from
          pointerEvents="none"
        >
          {context.value === undefined && placeholder !== undefined ? placeholder : children}
        </SelectValueFrame>
      )
    }
  )
)

SelectValue.displayName = VALUE_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectIcon
 * -----------------------------------------------------------------------------------------------*/

export const SelectIcon = styled(XStack, {
  name: 'SelectIcon',
  // @ts-ignore
  'aria-hidden': true,
  children: <Paragraph>▼</Paragraph>,
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
        {context.open ? (
          <FloatingOverlay lockScroll>{children}</FloatingOverlay>
        ) : (
          <div style={{ display: 'none' }}>{children}</div>
        )}
      </FloatingPortal>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'SelectViewport'

export const SelectViewportFrame = styled(ThemeableStack, {
  name: VIEWPORT_NAME,
  backgroundColor: '$background',
  elevate: true,

  variants: {
    size: {
      '...size': (val, { tokens }) => {
        return {
          borderRadius: tokens.size[val] ?? val,
        }
      },
    },
  },

  defaultVariants: {
    size: '$2',
  },
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
    console.log('rendering me')
    return (
      <>
        {/* Hide scrollbars cross-browser and enable momentum scroll for touch devices */}
        <style
          dangerouslySetInnerHTML={{
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`,
          }}
        />
        <FloatingFocusManager context={context.floatingContext} preventTabbing>
          <div {...context.interactions.getFloatingProps()}>
            <SelectViewportFrame
              data-radix-select-viewport=""
              // @ts-ignore
              role="presentation"
              {...viewportProps}
              ref={composedRefs}
            >
              {children}
            </SelectViewportFrame>
          </div>
        </FloatingFocusManager>
      </>
    )
  }
)

SelectViewport.displayName = VIEWPORT_NAME

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

interface SelectItemProps extends YStackProps {
  value: string
  index: number
  disabled?: boolean
  textValue?: string
}

const SelectItemFrame = styled(YStack, {
  name: ITEM_NAME,
  tag: 'li',
  // @ts-ignore
  role: 'option',
  width: '100%',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },

  variants: {
    size: {
      '...size': getSelectItemSize,
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

const SelectItem = React.forwardRef<TamaguiElement, SelectItemProps>(
  (props: ScopedProps<SelectItemProps>, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      index,
      ...itemProps
    } = props
    const context = useSelectContext(ITEM_NAME, __scopeSelect)
    const isSelected = context.value === value
    const [textValue, setTextValue] = React.useState(textValueProp ?? '')
    const [isFocused, setIsFocused] = React.useState(false)
    const composedRefs = useComposedRefs(
      forwardedRef
      // isSelected ? context.onSelectedItemChange : undefined
    )
    const textId = useId()

    const {
      selectedIndex,
      setSelectedIndex,
      listRef,
      open,
      setOpen,
      onChange,
      activeIndex,
      setActiveIndex,
      dataRef,
    } = context

    const timeoutRef = React.useRef<any>()
    const [allowMouseUp, setAllowMouseUp] = React.useState(false)

    function handleSelect() {
      setSelectedIndex(index)
      onChange(value)
      setOpen(false)
    }

    React.useEffect(() => {
      clearTimeout(timeoutRef.current)
      if (open) {
        if (selectedIndex !== index) {
          setAllowMouseUp(true)
        } else {
          timeoutRef.current = setTimeout(() => {
            setAllowMouseUp(true)
          }, 300)
        }
      } else {
        setAllowMouseUp(false)
      }
    }, [open, index, setActiveIndex, selectedIndex])

    function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter' || (event.key === ' ' && !dataRef.current.typing)) {
        event.preventDefault()
        handleSelect()
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
        <SelectItemFrame
          aria-labelledby={textId}
          // `isFocused` caveat fixes stuttering in VoiceOver
          aria-selected={isSelected && isFocused}
          data-state={isSelected ? 'active' : 'inactive'}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          tabIndex={disabled ? undefined : -1}
          {...itemProps}
          {...context.interactions.getItemProps({
            onClick: allowMouseUp ? handleSelect : undefined,
            onMouseUp: allowMouseUp ? handleSelect : undefined,
            onKeyDown: handleKeyDown,
          })}
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
  cursor: 'default',
})

type SelectItemTextProps = GetProps<typeof SelectItemTextFrame>

const SelectItemText = React.forwardRef<TamaguiElement, SelectItemTextProps>(
  (props: ScopedProps<SelectItemTextProps>, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const { __scopeSelect, className, style, ...itemTextProps } = props
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
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
        {itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode)
          : null}

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
 * SelectGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'SelectGroup'

type SelectGroupContextValue = { id: string }

const [SelectGroupContextProvider, useSelectGroupContext] =
  createSelectContext<SelectGroupContextValue>(GROUP_NAME)

const SelectGroupFrame = styled(YStack, {
  name: GROUP_NAME,
  width: '100%',
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

const SelectLabelFrame = styled(SelectItemTextFrame, {
  name: LABEL_NAME,

  variants: {
    size: {
      '...size': (val, extras) => {
        const size = getSelectItemSize(val, extras)
        return {
          ...size,
          paddingTop: size.paddingVertical * 4,
        }
      },
    },
  },

  defaultVariants: {
    size: '$4',
  },
})

export type SelectLabelProps = GetProps<typeof SelectLabelFrame>

const SelectLabel = React.forwardRef<TamaguiElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)
    return <SelectLabelFrame id={groupContext.id} {...labelProps} ref={forwardedRef} />
  }
)

SelectLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectScrollUpButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_UP_BUTTON_NAME = 'SelectScrollUpButton'

interface SelectScrollButtonProps
  extends Omit<SelectScrollButtonImplProps, 'dir' | 'componentName'> {}

const SelectScrollUpButton = React.forwardRef<TamaguiElement, SelectScrollButtonProps>(
  (props: ScopedProps<SelectScrollButtonProps>, forwardedRef) => {
    return (
      <SelectScrollButtonImpl
        componentName={SCROLL_UP_BUTTON_NAME}
        {...props}
        dir="up"
        ref={forwardedRef}
      />
    )
  }
)

SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectScrollDownButton
 * -----------------------------------------------------------------------------------------------*/

const SCROLL_DOWN_BUTTON_NAME = 'SelectScrollDownButton'

const SelectScrollDownButton = React.forwardRef<TamaguiElement, SelectScrollButtonProps>(
  (props: ScopedProps<SelectScrollButtonProps>, forwardedRef) => {
    return (
      <SelectScrollButtonImpl
        componentName={SCROLL_DOWN_BUTTON_NAME}
        {...props}
        dir="down"
        ref={forwardedRef}
      />
    )
  }
)

SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME

type SelectScrollButtonImplElement = TamaguiElement
interface SelectScrollButtonImplProps extends YStackProps {
  dir: 'up' | 'down'
  componentName: string
}

const SelectScrollButtonImpl = React.forwardRef<
  SelectScrollButtonImplElement,
  SelectScrollButtonImplProps
>((props: ScopedProps<SelectScrollButtonImplProps>, forwardedRef) => {
  const { __scopeSelect, dir, componentName, ...scrollIndicatorProps } = props
  const { floatingRef, increaseHeight, forceUpdate, ...context } = useSelectContext(
    componentName,
    __scopeSelect
  )
  const intervalRef = React.useRef<any>()
  const loopingRef = React.useRef(false)
  const isVisible = context[dir === 'down' ? 'canScrollDown' : 'canScrollUp']

  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    strategy: 'fixed',
    placement: dir === 'up' ? 'top' : 'bottom',
    middleware: [offset(({ rects }) => -rects.floating.height)],
  })

  const composedRefs = useComposedRefs(forwardedRef, floating)

  React.useLayoutEffect(() => {
    reference(floatingRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, floatingRef.current])

  React.useEffect(() => {
    if (!refs.reference.current || !refs.floating.current || !isVisible) {
      return
    }

    const cleanup = autoUpdate(refs.reference.current, refs.floating.current, update, {
      animationFrame: true,
    })

    return () => {
      clearInterval(intervalRef.current)
      loopingRef.current = false
      cleanup()
    }
  }, [isVisible, update, refs.floating, refs.reference])

  if (!isVisible) {
    return null
  }

  const handleScrollArrowChange = () => {
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

  return (
    <YStack
      ref={composedRefs}
      componentName={componentName}
      aria-hidden
      {...scrollIndicatorProps}
      // @ts-expect-error
      position={strategy}
      left={x || 0}
      top={y || 0}
      width={`calc(${(floatingRef.current?.offsetWidth ?? 0) - 2}px)`}
      background={`linear-gradient(to ${
        dir === 'up' ? 'bottom' : 'top'
      }, #29282b 50%, rgba(53, 54, 55, 0.01))`}
      onPointerMove={() => {
        if (!loopingRef.current) {
          intervalRef.current = setInterval(handleScrollArrowChange, 1000 / 60)
          loopingRef.current = true
        }
      }}
      onPointerLeave={() => {
        loopingRef.current = false
        clearInterval(intervalRef.current)
      }}
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

    console.log('value', value, scrollTop)

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

    // let optionIndex = 0
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

    const [valueNode, setValueNode] = React.useState<HTMLElement | null>(null)
    const [valueNodeHasChildren, setValueNodeHasChildren] = React.useState(false)

    return (
      <SelectProvider
        scope={__scopeSelect}
        increaseHeight={increaseHeight}
        forceUpdate={forceUpdate}
        floatingRef={floatingRef}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        valueNodeHasChildren={valueNodeHasChildren}
        onValueNodeHasChildrenChange={setValueNodeHasChildren}
        interactions={{
          ...interactions,
          getReferenceProps() {
            return interactions.getReferenceProps({
              ref: reference,
              className: 'SelectTrigger',
              onKeyDown(event) {
                if (
                  event.key === 'Enter' ||
                  (event.key === ' ' && !context.dataRef.current.typing)
                ) {
                  event.preventDefault()
                  setOpen(true)
                }
              },
            })
          },
          getFloatingProps() {
            return interactions.getFloatingProps({
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
            })
          },
        }}
        floatingContext={context}
        activeIndex={0}
        canScrollDown={!!showDownArrow}
        canScrollUp={!!showUpArrow}
        controlledScrolling
        dataRef={null as any}
        listRef={listItemsRef}
        onChange={setValue}
        selectedIndex={0}
        setActiveIndex={() => {}}
        setElement={() => {}}
        setOpen={() => {}}
        setSelectedIndex={() => {}}
        value={value}
        // trigger={trigger}
        // onTriggerChange={setTrigger}
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

export { createSelectScope }
