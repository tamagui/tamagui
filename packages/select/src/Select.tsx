import { Adapt, useAdaptParent } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  TamaguiElement,
  getVariableValue,
  isWeb,
  styled,
  useGet,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
import { getSpace } from '@tamagui/get-token'
import { ListItem, ListItemProps } from '@tamagui/list-item'
import { PortalHost } from '@tamagui/portal'
import { Separator } from '@tamagui/separator'
import { Sheet, SheetController } from '@tamagui/sheet'
import { ThemeableStack, XStack, YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

import { SELECT_NAME } from './constants'
import { SelectProvider, createSelectContext, useSelectContext } from './context'
import { SelectContent } from './SelectContent'
import { SelectInlineImpl } from './SelectImpl'
import { SelectScrollDownButton, SelectScrollUpButton } from './SelectScrollButton'
import { SelectViewport } from './SelectViewport'
import { ScopedProps, SelectImplProps, SelectProps } from './types'
import {
  useSelectBreakpointActive,
  useShowSelectSheet,
} from './useSelectBreakpointActive'

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SelectTrigger'

export type SelectTriggerProps = ListItemProps

export const SelectTrigger = React.forwardRef<TamaguiElement, SelectTriggerProps>(
  function SelectTrigger(props: ScopedProps<SelectTriggerProps>, forwardedRef) {
    const { __scopeSelect, disabled = false, unstyled = false, ...triggerProps } = props

    const context = useSelectContext(TRIGGER_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.floatingContext?.refs.setReference as any
    )
    // const getItems = useCollection(__scopeSelect)
    // const labelId = useLabelContext(context.trigger)
    // const labelledBy = ariaLabelledby || labelId

    if (context.shouldRenderWebNative) {
      return null
    }

    return (
      <ListItem
        componentName={TRIGGER_NAME}
        unstyled={unstyled}
        {...(!unstyled && {
          backgrounded: true,
          radiused: true,
          hoverTheme: true,
          pressTheme: true,
          focusable: true,
          focusStyle: {
            outlineStyle: 'solid',
            outlineWidth: 2,
            outlineColor: '$borderColorFocus',
          },
          borderWidth: 1,
        })}
        size={context.size}
        // aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-autocomplete="none"
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={composedRefs}
        {...(process.env.TAMAGUI_TARGET === 'web' && context.interactions
          ? {
              ...context.interactions.getReferenceProps(),
              onMouseDown() {
                context.floatingContext?.update()
                context.setOpen(!context.open)
              },
            }
          : {
              onPress() {
                context.setOpen(!context.open)
              },
            })}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue'

const SelectValueFrame = styled(SizableText, {
  name: VALUE_NAME,
  userSelect: 'none',
})

type SelectValueProps = GetProps<typeof SelectValueFrame> & {
  placeholder?: React.ReactNode
}

const SelectValue = SelectValueFrame.styleable<SelectValueProps>(function SelectValue(
  {
    __scopeSelect,
    children: childrenProp,
    placeholder,
    ...props
  }: ScopedProps<SelectValueProps>,
  forwardedRef
) {
  // We ignore `className` and `style` as this part shouldn't be styled.
  const context = useSelectContext(VALUE_NAME, __scopeSelect)
  const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange)
  const children = childrenProp ?? context.selectedItem
  const isEmptyValue = context.value == null || context.value === ''
  const selectValueChildren = isEmptyValue ? placeholder ?? children : children

  return (
    <SelectValueFrame
      size={context.size}
      ref={composedRefs}
      // we don't want events from the portalled `SelectValue` children to bubble
      // through the item they came from
      pointerEvents="none"
      {...props}
    >
      {unwrapSelectItem(selectValueChildren)}
    </SelectValueFrame>
  )
})

function unwrapSelectItem(selectValueChildren: any) {
  return React.Children.map(selectValueChildren, (child) => {
    if (child) {
      if (child.type?.staticConfig?.componentName === ITEM_TEXT_NAME) {
        return child.props.children
      }
      if (child.props?.children) {
        return unwrapSelectItem(child.props.children)
      }
    }
    return child
  })
}

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
 * SelectItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'SelectItem'

type SelectItemContextValue = {
  value: string
  textId: string
  isSelected: boolean
}

const [SelectItemContextProvider, useSelectItemContext] =
  createSelectContext<SelectItemContextValue>(ITEM_NAME)

export interface SelectItemProps extends ListItemProps {
  value: string
  index: number
  disabled?: boolean
  textValue?: string
}

export const SelectItem = React.forwardRef<TamaguiElement, SelectItemProps>(
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
    const textId = React.useId()

    const {
      selectedIndex,
      setSelectedIndex,
      listRef,
      open,
      setOpen,
      onChange,
      activeIndex,
      allowMouseUpRef,
      allowSelectRef,
      setValueAtIndex,
      selectTimeoutRef,
      dataRef,
    } = context

    const composedRefs = useComposedRefs(forwardedRef, (node) => {
      if (!isWeb) return
      if (node instanceof HTMLElement) {
        if (listRef) {
          listRef.current[index] = node
        }
      }
    })

    useIsomorphicLayoutEffect(() => {
      setValueAtIndex(index, value)
    }, [index, setValueAtIndex, value])

    function handleSelect() {
      setSelectedIndex(index)
      onChange(value)
      setOpen(false)
    }

    const selectItemProps = context.interactions
      ? context.interactions.getItemProps({
          onTouchStart() {
            allowSelectRef!.current = true
            allowMouseUpRef!.current = false
          },
          onKeyDown(event) {
            if (
              event.key === 'Enter' ||
              (event.key === ' ' && !dataRef?.current.typing)
            ) {
              event.preventDefault()
              handleSelect()
            } else {
              allowSelectRef!.current = true
            }
          },
          onClick() {
            if (allowSelectRef!.current) {
              setSelectedIndex(index)
              setOpen(false)
            }
          },
          onMouseUp() {
            if (!allowMouseUpRef!.current) {
              return
            }

            if (allowSelectRef!.current) {
              handleSelect()
            }

            // On touch devices, prevent the element from
            // immediately closing `onClick` by deferring it
            clearTimeout(selectTimeoutRef!.current)
            selectTimeoutRef!.current = setTimeout(() => {
              allowSelectRef!.current = true
            })
          },
        })
      : {
          onPress: handleSelect,
        }

    const isActive = activeIndex === index

    return (
      <SelectItemContextProvider
        scope={__scopeSelect}
        value={value}
        textId={textId || ''}
        isSelected={isSelected}
      >
        {context.shouldRenderWebNative ? (
          <option value={value}>{props.children}</option>
        ) : (
          <ListItem
            tag="div"
            componentName={ITEM_NAME}
            backgrounded
            pressTheme
            hoverTheme
            focusTheme
            cursor="default"
            outlineWidth={0}
            ref={composedRefs}
            aria-labelledby={textId}
            aria-selected={isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
            tabIndex={disabled ? undefined : -1}
            size={context.size}
            {...itemProps}
            {...selectItemProps}
          />
        )}
      </SelectItemContextProvider>
    )
  }
)

SelectItem.displayName = ITEM_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectItemText
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TEXT_NAME = 'SelectItemText'

export const SelectItemTextFrame = styled(SizableText, {
  name: ITEM_TEXT_NAME,

  variants: {
    unstyled: {
      false: {
        userSelect: 'none',
        color: '$color',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

type SelectItemTextProps = GetProps<typeof SelectItemTextFrame>

const SelectItemText = React.forwardRef<TamaguiElement, SelectItemTextProps>(
  (props: ScopedProps<SelectItemTextProps>, forwardedRef) => {
    const { __scopeSelect, className, ...itemTextProps } = props
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect)
    const ref = React.useRef<TamaguiElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect)
    const isSelected = Boolean(itemContext.isSelected && context.valueNode)
    const contents = React.useMemo(
      () => (
        <SelectItemTextFrame
          className={className}
          size={context.size}
          id={itemContext.textId}
          {...itemTextProps}
          ref={composedRefs}
        />
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props, context.size, className, itemContext.textId]
    )

    // until portals work in sub-trees on RN, use this just for native:
    useIsomorphicLayoutEffect(() => {
      if (isSelected) {
        context.setSelectedItem(contents)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelected, contents])

    if (context.shouldRenderWebNative) return <>{props.children}</>
    return (
      <>
        {contents}

        {/* Portal the select item text into the trigger value node */}
        {/* this needs some extra stability between renders */}
        {/* {isWeb && isSelected
          ? ReactDOM.createPortal(itemTextProps.children, context.valueNode!)
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
    const context = useSelectContext(ITEM_INDICATOR_NAME, __scopeSelect)
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect)

    if (context.shouldRenderWebNative) {
      return null
    }

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

export const SelectGroupFrame = styled(YStack, {
  name: GROUP_NAME,
  width: '100%',
})

const NativeSelectTextFrame = styled(SizableText, {
  tag: 'select',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
})

const NativeSelectFrame = styled(ThemeableStack, {
  name: 'NativeSelect',

  bordered: true,
  userSelect: 'none',
  outlineWidth: 0,
  paddingRight: 10,

  variants: {
    size: {
      '...size': (val, extras) => {
        const { tokens } = extras
        const paddingHorizontal = getVariableValue(tokens.space[val])

        return {
          borderRadius: tokens.radius[val] ?? val,
          minHeight: tokens.size[val],
          paddingRight: paddingHorizontal + 20,
          paddingLeft: paddingHorizontal,
          paddingVertical: getSpace(val, {
            shift: -3,
          }),
        }
      },
    },
  } as const,

  defaultVariants: {
    size: '$2',
  },
})

type SelectGroupProps = GetProps<typeof SelectGroupFrame>

const SelectGroup = React.forwardRef<TamaguiElement, SelectGroupProps>(
  (props: ScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const groupId = React.useId()

    const context = useSelectContext(GROUP_NAME, __scopeSelect)
    const size = context.size ?? '$true'
    const nativeSelectRef = React.useRef<HTMLSelectElement>(null)

    const content = (function () {
      if (context.shouldRenderWebNative) {
        return (
          // @ts-expect-error until we support typing based on tag
          <NativeSelectFrame asChild size={size} value={context.value}>
            <NativeSelectTextFrame
              // @ts-ignore it's ok since tag="select"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                context.onChange(event.currentTarget.value)
              }}
              size={size}
              ref={nativeSelectRef}
              style={{
                color: 'var(--color)',
                // @ts-ignore
                appearance: 'none',
              }}
            >
              {props.children}
            </NativeSelectTextFrame>
          </NativeSelectFrame>
        )
      }
      return (
        <SelectGroupFrame
          // @ts-ignore
          role="group"
          aria-labelledby={groupId}
          {...groupProps}
          ref={forwardedRef}
        />
      )
    })()
    return (
      <SelectGroupContextProvider scope={__scopeSelect} id={groupId || ''}>
        {content}
      </SelectGroupContextProvider>
    )
  }
)

SelectGroup.displayName = GROUP_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'SelectLabel'

export type SelectLabelProps = ListItemProps

const SelectLabel = React.forwardRef<TamaguiElement, SelectLabelProps>(
  (props: ScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const context = useSelectContext(LABEL_NAME, __scopeSelect)
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect)

    if (context.shouldRenderWebNative) {
      return null
    }

    return (
      <ListItem
        tag="div"
        componentName={LABEL_NAME}
        fontWeight="800"
        id={groupContext.id}
        size={context.size}
        {...labelProps}
        ref={forwardedRef}
      />
    )
  }
)

SelectLabel.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
 * SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

export const SelectSeparator = styled(Separator, {
  name: 'SelectSeparator',
})

const SelectSheetController = (
  props: ScopedProps<{}> & {
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }
) => {
  const context = useSelectContext('SelectSheetController', props.__scopeSelect)
  const showSheet = useShowSelectSheet(context)
  const breakpointActive = useSelectBreakpointActive(context.sheetBreakpoint)
  const getShowSheet = useGet(showSheet)

  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val)
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  )
}

const SelectSheetImpl = (props: SelectImplProps) => {
  return <>{props.children}</>
}

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

export const Select = withStaticProperties(
  (props: ScopedProps<SelectProps>) => {
    const {
      __scopeSelect,
      native,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      value: valueProp,
      defaultValue,
      onValueChange,
      size: sizeProp = '$true',
      dir,
    } = props

    const id = React.useId()
    const scopeKey = __scopeSelect ? Object.keys(__scopeSelect)[0] ?? id : id

    const { when, AdaptProvider } = useAdaptParent({
      Contents: React.useCallback(
        () => <PortalHost name={`${scopeKey}SheetContents`} />,
        [scopeKey]
      ),
    })
    const sheetBreakpoint = when
    const isSheet = useSelectBreakpointActive(sheetBreakpoint)
    const SelectImpl = isSheet || !isWeb ? SelectSheetImpl : SelectInlineImpl
    const forceUpdate = React.useReducer(() => ({}), {})[1]
    const [selectedItem, setSelectedItem] = React.useState<React.ReactNode>(null)

    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
    })

    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue || '',
      onChange: onValueChange,
      transition: true,
    })

    const [activeIndex, setActiveIndex] = React.useState<number | null>(0)
    const selectedIndexRef = React.useRef<number | null>(null)
    const activeIndexRef = React.useRef<number | null>(null)
    const listContentRef = React.useRef<string[]>([])
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [valueNode, setValueNode] = React.useState<HTMLElement | null>(null)

    useIsomorphicLayoutEffect(() => {
      selectedIndexRef.current = selectedIndex
      activeIndexRef.current = activeIndex
    })

    const shouldRenderWebNative =
      isWeb &&
      (native === true ||
        native === 'web' ||
        (Array.isArray(native) && native.includes('web')))

    return (
      <AdaptProvider>
        <SelectProvider
          dir={dir}
          blockSelection={false}
          size={sizeProp}
          fallback={false}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          forceUpdate={forceUpdate}
          valueNode={valueNode}
          onValueNodeChange={setValueNode}
          scopeKey={scopeKey}
          sheetBreakpoint={sheetBreakpoint}
          scope={__scopeSelect}
          setValueAtIndex={(index, value) => {
            listContentRef.current[index] = value
          }}
          activeIndex={activeIndex}
          onChange={setValue}
          selectedIndex={selectedIndex}
          setActiveIndex={setActiveIndex}
          setOpen={setOpen}
          setSelectedIndex={setSelectedIndex}
          value={value}
          open={open}
          native={native}
          shouldRenderWebNative={shouldRenderWebNative}
        >
          <SelectSheetController onOpenChange={setOpen} __scopeSelect={__scopeSelect}>
            {shouldRenderWebNative ? (
              children
            ) : (
              <SelectImpl
                activeIndexRef={activeIndexRef}
                listContentRef={listContentRef}
                selectedIndexRef={selectedIndexRef}
                {...props}
                open={open}
                value={value}
              >
                {children}
              </SelectImpl>
            )}
          </SelectSheetController>
        </SelectProvider>
      </AdaptProvider>
    )
  },
  {
    Adapt,
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
    Sheet: Sheet.Controlled,
  }
)

// @ts-ignore
Select.displayName = SELECT_NAME
