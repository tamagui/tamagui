import { Adapt, AdaptParent, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { FontSizeTokens, GetProps, TamaguiElement } from '@tamagui/core'
import { getVariableValue, styled, useEvent, useGet } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import { getSpace } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import type { ListItemProps } from '@tamagui/list-item'
import { ListItem } from '@tamagui/list-item'
import { Separator } from '@tamagui/separator'
import { Sheet, SheetController } from '@tamagui/sheet'
import { ThemeableStack, XStack, YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDebounce } from '@tamagui/use-debounce'
import * as React from 'react'
import {
  SelectItemParentProvider,
  SelectProvider,
  createSelectContext,
  useSelectContext,
  useSelectItemParentContext,
} from './context'
import { SelectContent } from './SelectContent'
import { SelectInlineImpl } from './SelectImpl'
import { SelectItem, useSelectItemContext } from './SelectItem'
import { ITEM_TEXT_NAME, SelectItemText } from './SelectItemText'
import { SelectScrollDownButton, SelectScrollUpButton } from './SelectScrollButton'
import { SelectTrigger } from './SelectTrigger'
import { SelectViewport } from './SelectViewport'
import type { SelectImplProps, SelectProps, SelectScopedProps } from './types'
import { useShowSelectSheet } from './useSelectBreakpointActive'

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue'

const SelectValueFrame = styled(SizableText, {
  name: VALUE_NAME,
  userSelect: 'none',
})

export interface SelectValueExtraProps {
  placeholder?: React.ReactNode
}

type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps

const SelectValue = SelectValueFrame.styleable<SelectValueExtraProps>(
  function SelectValue(
    {
      __scopeSelect,
      children: childrenProp,
      placeholder,
      ...props
    }: SelectScopedProps<SelectValueProps>,
    forwardedRef
  ) {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const context = useSelectContext(VALUE_NAME, __scopeSelect)
    const itemParentContext = useSelectItemParentContext(VALUE_NAME, __scopeSelect)
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange)
    const children = childrenProp ?? context.selectedItem
    const isEmptyValue = context.value == null || context.value === ''
    const selectValueChildren = isEmptyValue ? (placeholder ?? children) : children

    return (
      <SelectValueFrame
        {...(!props.unstyled && {
          size: itemParentContext.size as any,
          ellipse: true,
          // we don't want events from the portalled `SelectValue` children to bubble
          // through the item they came from
          pointerEvents: 'none',
        })}
        ref={composedRefs}
        {...props}
      >
        {unwrapSelectItem(selectValueChildren)}
      </SelectValueFrame>
    )
  }
)

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
 * SelectItemIndicator
 * -----------------------------------------------------------------------------------------------*/

const ITEM_INDICATOR_NAME = 'SelectItemIndicator'

const SelectItemIndicatorFrame = styled(XStack, {
  name: ITEM_TEXT_NAME,
})

type SelectItemIndicatorProps = GetProps<typeof SelectItemIndicatorFrame>

const SelectItemIndicator = React.forwardRef<TamaguiElement, SelectItemIndicatorProps>(
  (props: SelectScopedProps<SelectItemIndicatorProps>, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props
    const context = useSelectItemParentContext(ITEM_INDICATOR_NAME, __scopeSelect)
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
  (props: SelectScopedProps<SelectGroupProps>, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props
    const groupId = React.useId()

    const context = useSelectContext(GROUP_NAME, __scopeSelect)
    const itemParentContext = useSelectItemParentContext(GROUP_NAME, __scopeSelect)
    const size = itemParentContext.size ?? '$true'
    const nativeSelectRef = React.useRef<HTMLSelectElement>(null)

    const content = (() => {
      if (itemParentContext.shouldRenderWebNative) {
        return (
          <NativeSelectFrame
            asChild
            size={size}
            // @ts-expect-error until we support typing based on tag
            value={context.value}
            id={itemParentContext.id}
          >
            <NativeSelectTextFrame
              // @ts-ignore it's ok since tag="select"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                itemParentContext.onChange(event.currentTarget.value)
              }}
              size={size as FontSizeTokens}
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
  (props: SelectScopedProps<SelectLabelProps>, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props
    const context = useSelectItemParentContext(LABEL_NAME, __scopeSelect)
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
  props: SelectScopedProps<{}> & {
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }
) => {
  const context = useSelectContext('SelectSheetController', props.__scopeSelect)
  const showSheet = useShowSelectSheet(context)
  const isAdapted = useAdaptIsActive()
  const getShowSheet = useGet(showSheet)

  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val)
        }
      }}
      open={context.open}
      hidden={isAdapted === false}
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
  function Select(props: SelectScopedProps<SelectProps>) {
    const internalId = React.useId()
    const scopeKey = props.__scopeSelect
      ? (Object.keys(props.__scopeSelect)[0] ?? internalId)
      : internalId

    return (
      <AdaptParent scope={`${scopeKey}SheetContents`} portal>
        <SelectInner scopeKey={scopeKey} {...props} />
      </AdaptParent>
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

function useEmitter<A>() {
  const listeners = React.useRef<Set<Function>>()
  if (!listeners.current) {
    listeners.current = new Set()
  }
  const emit = (value: A) => {
    listeners.current!.forEach((l) => l(value))
  }
  const subscribe = React.useCallback((listener: (val: A) => void) => {
    listeners.current!.add(listener)
    return () => {
      listeners.current!.delete(listener)
    }
  }, [])
  return [emit, subscribe] as const
}

function SelectInner(props: SelectScopedProps<SelectProps> & { scopeKey: string }) {
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
    disablePreventBodyScroll,
    size: sizeProp = '$true',
    onActiveChange,
    dir,
    id,
  } = props

  const isAdapted = useAdaptIsActive()
  const SelectImpl = isAdapted || !isWeb ? SelectSheetImpl : SelectInlineImpl
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

  React.useEffect(() => {
    if (open) {
      emitValue(value)
    }
  }, [open])

  React.useEffect(() => {
    emitValue(value)
  }, [value])

  if (process.env.TAMAGUI_TARGET === 'native') {
    React.useEffect(() => {
      if (!props.id) return

      return registerFocusable(props.id, {
        focusAndSelect: () => {
          setOpen?.((value) => !value)
        },
        focus: () => {},
      })
    }, [props.id])
  }

  const [activeIndex, setActiveIndex] = React.useState<number | null>(0)

  const [emitValue, valueSubscribe] = useEmitter<any>()
  const [emitActiveIndex, activeIndexSubscribe] = useEmitter<number>()

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

  // TODO its calling this a bunch if you move mouse around on select items fast
  // using a debounce for now but need to fix root issue
  const setActiveIndexDebounced = useDebounce(
    (index: number | null) => {
      setActiveIndex((prev) => {
        if (prev !== index) {
          if (typeof index === 'number') {
            emitActiveIndex(index)
          }
          return index
        }
        return prev
      })
    },
    1,
    {},
    []
  )

  return (
    <SelectItemParentProvider
      scope={__scopeSelect}
      initialValue={React.useMemo(() => value, [open])}
      size={sizeProp}
      activeIndexSubscribe={activeIndexSubscribe}
      valueSubscribe={valueSubscribe}
      setOpen={setOpen}
      id={id}
      onChange={React.useCallback((val) => {
        setValue(val)
        emitValue(val)
      }, [])}
      onActiveChange={useEvent((...args) => {
        onActiveChange?.(...args)
      })}
      setSelectedIndex={setSelectedIndex}
      setValueAtIndex={React.useCallback((index, value) => {
        listContentRef.current[index] = value
      }, [])}
      shouldRenderWebNative={shouldRenderWebNative}
    >
      <SelectProvider
        scope={__scopeSelect}
        disablePreventBodyScroll={disablePreventBodyScroll}
        dir={dir}
        blockSelection={false}
        fallback={false}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        forceUpdate={forceUpdate}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        scopeKey={props.scopeKey}
        activeIndex={activeIndex}
        selectedIndex={selectedIndex}
        setActiveIndex={setActiveIndexDebounced}
        value={value}
        open={open}
        native={native}
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
    </SelectItemParentProvider>
  )
}
