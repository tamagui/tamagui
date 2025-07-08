import { Adapt, AdaptParent, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { FontSizeTokens, GetProps, TamaguiElement } from '@tamagui/core'
import {
  createStyledContext,
  getVariableValue,
  styled,
  useEvent,
  useGet,
} from '@tamagui/core'
import { FocusScopeController } from '@tamagui/focus-scope'
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

export type SelectValueExtraProps = SelectScopedProps<{
  placeholder?: React.ReactNode
}>

export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps

const SelectValue = SelectValueFrame.styleable<SelectValueExtraProps>(
  function SelectValue(
    { scope, children: childrenProp, placeholder, ...props },
    forwardedRef
  ) {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)

    // @ts-ignore TODO react 19 type needs fix
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

const SelectItemIndicatorFrame = styled(XStack, {
  name: 'SelectItemIndicator',
})

type SelectItemIndicatorProps = SelectScopedProps<
  GetProps<typeof SelectItemIndicatorFrame>
>

const SelectItemIndicator = React.forwardRef<TamaguiElement, SelectItemIndicatorProps>(
  function SelectItemIndicator(props, forwardedRef) {
    const { scope, ...itemIndicatorProps } = props
    const context = useSelectItemParentContext(scope)
    const itemContext = useSelectItemContext(scope)

    if (context.shouldRenderWebNative) {
      return null
    }

    return itemContext.isSelected ? (
      <SelectItemIndicatorFrame aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
    ) : null
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'SelectGroup'

type SelectGroupContextValue = { id: string }

const { Provider: SelectGroupContextProvider, useStyledContext: useSelectGroupContext } =
  createStyledContext<SelectGroupContextValue>({ id: '' }, 'SelectGroup')

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

type SelectGroupProps = SelectScopedProps<GetProps<typeof SelectGroupFrame>>

const SelectGroup = React.forwardRef<TamaguiElement, SelectGroupProps>(
  (props, forwardedRef) => {
    const { scope, ...groupProps } = props
    const groupId = React.useId()

    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)
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
      <SelectGroupContextProvider scope={scope} id={groupId || ''}>
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

export type SelectLabelProps = SelectScopedProps<ListItemProps>

const SelectLabel = React.forwardRef<TamaguiElement, SelectLabelProps>(
  (props, forwardedRef) => {
    const { scope, ...labelProps } = props
    const context = useSelectItemParentContext(scope)
    const groupContext = useSelectGroupContext(scope)

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
  props: SelectScopedProps<{
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }>
) => {
  const context = useSelectContext(props.scope)
  const showSheet = useShowSelectSheet(context)
  const isAdapted = useAdaptIsActive(context.adaptScope)
  const getShowSheet = useGet(showSheet)

  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val)
        }
      }}
      open={context.open}
      hidden={!isAdapted}
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
    const adaptScope = `AdaptSelect${props.scope || ''}`

    return (
      <AdaptParent scope={adaptScope} portal>
        <SelectInner scope={props.scope} adaptScope={adaptScope} {...props} />
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
    FocusScope: FocusScopeController,
  }
)

function useEmitter<A>() {
  const listeners = React.useRef<Set<Function>>(null)
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

function SelectInner(props: SelectScopedProps<SelectProps> & { adaptScope: string }) {
  const {
    scope = '',
    adaptScope,
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

  const isAdapted = useAdaptIsActive(adaptScope)
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
      scopeName={scope}
      scope={scope}
      adaptScope={adaptScope}
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
      onActiveChange={useEvent((value, index) => {
        onActiveChange?.(value, index)
      })}
      setSelectedIndex={setSelectedIndex}
      setValueAtIndex={React.useCallback((index, value) => {
        listContentRef.current[index] = value
      }, [])}
      shouldRenderWebNative={shouldRenderWebNative}
    >
      <SelectProvider
        scope={scope}
        scopeName={scope}
        adaptScope={adaptScope}
        disablePreventBodyScroll={disablePreventBodyScroll}
        dir={dir}
        blockSelection={false}
        fallback={false}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        forceUpdate={forceUpdate}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        activeIndex={activeIndex}
        selectedIndex={selectedIndex}
        setActiveIndex={setActiveIndexDebounced}
        value={value}
        open={open}
        native={native}
      >
        <SelectSheetController onOpenChange={setOpen} scope={scope}>
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
