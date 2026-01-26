import { Adapt, AdaptParent, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { FontSizeTokens, GetProps, SizeTokens, TamaguiElement } from '@tamagui/core'
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
import { Separator } from '@tamagui/separator'
import { SheetController } from '@tamagui/sheet/controller'
import { XStack, YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
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

    const composedRefs = useComposedRefs(
      // @ts-ignore TODO react 19 type needs fix
      forwardedRef,
      context.onValueNodeChange as any
    )
    const isEmptyValue = context.value == null || context.value === ''

    // Use renderValue for SSR support - called synchronously during render
    // Falls back to the portal-based selectedItem, then to the raw value for SSR
    const renderedValue = context.renderValue?.(context.value)
    const children =
      childrenProp ?? renderedValue ?? itemParentContext.selectedItem ?? context.value
    const selectValueChildren = isEmptyValue ? (placeholder ?? children) : children

    return (
      <SelectValueFrame
        {...(!props.unstyled && {
          size: itemParentContext.size as any,
          ellipsis: true,
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
 * SelectIndicator
 * -----------------------------------------------------------------------------------------------*/

const SelectIndicatorFrame = styled(YStack, {
  name: 'SelectIndicator',

  variants: {
    unstyled: {
      false: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
        backgroundColor: '$backgroundHover',
        borderRadius: 0,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type SelectIndicatorProps = GetProps<typeof SelectIndicatorFrame>

const SelectIndicator = SelectIndicatorFrame.styleable<
  SelectScopedProps<SelectIndicatorProps>
>(function SelectIndicator({ scope, ...props }, forwardedRef) {
  const itemContext = useSelectItemParentContext(scope)
  const context = useSelectContext(scope)
  const [layout, setLayout] = React.useState<any>(null)

  const rafRef = React.useRef<any>(0)

  React.useLayoutEffect(() => {
    const update = (index: number | null) => {
      if (typeof index !== 'number') return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const node = itemContext.listRef?.current?.[index]
        if (node) {
          setLayout({
            width: Math.round(node.offsetWidth),
            height: Math.round(node.offsetHeight),
            x: Math.round(node.offsetLeft),
            y: Math.round(node.offsetTop),
          })
        }
      })
    }

    // use ref for initial read to avoid depending on state
    if (context.open && context.activeIndexRef.current !== null) {
      update(context.activeIndexRef.current)
    }

    return itemContext.activeIndexSubscribe(update)
  }, [context.open, itemContext.listRef])

  if (!layout) return null

  return (
    <SelectIndicatorFrame
      ref={forwardedRef}
      {...props}
      width={layout.width}
      height={layout.height}
      x={layout.x}
      y={layout.y}
    />
  )
})

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
  render: 'select',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
})

const NativeSelectFrame = styled(YStack, {
  name: 'NativeSelect',

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

    unstyled: {
      false: {
        borderWidth: 1,
        borderColor: '$borderColor',
        userSelect: 'none',
        outlineWidth: 0,
        paddingRight: 10,
      },
    },
  } as const,

  defaultVariants: {
    size: '$2',
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
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
              // @ts-ignore it's ok since render="select"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                itemParentContext.onChange(event.currentTarget.value)
              }}
              size={size as FontSizeTokens}
              ref={nativeSelectRef as any}
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

const SelectLabelFrame = styled(SizableText, {
  name: LABEL_NAME,

  variants: {
    unstyled: {
      false: {
        size: '$true',
        ellipsis: true,
        maxWidth: '100%',
        cursor: 'default',
      },
    },

    size: {
      '...size': (val: SizeTokens, { tokens }) => {
        return {
          paddingHorizontal: tokens.space[val],
          paddingVertical: getSpace(tokens.space[val], {
            shift: -4,
          }),
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type SelectLabelProps = SelectScopedProps<GetProps<typeof SelectLabelFrame>>

const SelectLabel = SelectLabelFrame.styleable<{ scope?: any }>(
  (props: SelectLabelProps, forwardedRef) => {
    const { scope, ...labelProps } = props
    const context = useSelectItemParentContext(scope)
    const groupContext = useSelectGroupContext(scope)

    if (context.shouldRenderWebNative) {
      return null
    }

    return (
      <SelectLabelFrame
        render="div"
        id={groupContext.id}
        size={context.size}
        {...labelProps}
        ref={forwardedRef}
      />
    )
  }
)

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
  function Select<Value extends string = string>(
    props: SelectScopedProps<SelectProps<Value>>
  ) {
    const adaptScope = `AdaptSelect${props.scope || ''}`

    return (
      <AdaptParent scope={adaptScope} portal>
        <SelectInner scope={props.scope} adaptScope={adaptScope} {...props} />
      </AdaptParent>
    )
  },
  {
    Adapt: Adapt,
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
    Indicator: SelectIndicator,
    FocusScope: FocusScopeController,
  }
)

function useEmitter<A>() {
  const listenersRef = React.useRef<Set<Function>>(new Set())
  const emit = React.useCallback((value: A) => {
    listenersRef.current.forEach((l) => l(value))
  }, [])
  const subscribe = React.useCallback((listener: (val: A) => void) => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
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
    renderValue,
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

  // activeIndex is stored in a ref to avoid re-renders on every hover
  // we have two setters:
  // - setActiveIndexFast: updates ref + emits to subscribers (no re-render) - use for hover/navigation
  // - setActiveIndex: updates ref + emits + triggers re-render - use when UI needs to update
  // initialize to null so floating-ui starts from selectedIndex on first open
  const activeIndexRef = React.useRef<number | null>(null)
  const [activeIndex, setActiveIndexState] = React.useState<number | null>(null)

  const [emitValue, valueSubscribe] = useEmitter<any>()
  const [emitActiveIndex, activeIndexSubscribe] = useEmitter<number>()

  const selectedIndexRef = React.useRef<number | null>(null)
  const listContentRef = React.useRef<string[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [valueNode, setValueNode] = React.useState<HTMLElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    selectedIndexRef.current = selectedIndex
  })

  const shouldRenderWebNative =
    isWeb &&
    (native === true ||
      native === 'web' ||
      (Array.isArray(native) && native.includes('web')))

  // fast setter: updates ref + emits to subscribers without causing re-renders
  // use this for mouse hover / keyboard navigation where we don't need parent re-renders
  const setActiveIndexFast = React.useCallback(
    (index: number | null) => {
      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index
        if (typeof index === 'number') {
          emitActiveIndex(index)
        }
      }
    },
    [emitActiveIndex]
  )

  // slow setter: also triggers a re-render for components that need the state value
  // use this sparingly, e.g., when controlled scrolling needs to scroll item into view
  const setActiveIndex = React.useCallback(
    (index: number | null) => {
      setActiveIndexFast(index)
      setActiveIndexState(index)
    },
    [setActiveIndexFast]
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
      setActiveIndexFast={setActiveIndexFast}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    >
      <SelectProvider
        scope={scope}
        scopeName={scope}
        adaptScope={adaptScope}
        disablePreventBodyScroll={disablePreventBodyScroll}
        dir={dir}
        blockSelection={false}
        fallback={false}
        forceUpdate={forceUpdate}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        activeIndex={activeIndex}
        activeIndexRef={activeIndexRef}
        selectedIndex={selectedIndex}
        setActiveIndex={setActiveIndex}
        value={value}
        open={open}
        native={native}
        renderValue={renderValue}
      >
        <SelectSheetController onOpenChange={setOpen} scope={scope}>
          {shouldRenderWebNative ? (
            children
          ) : (
            <SelectImpl
              activeIndexRef={activeIndexRef}
              listContentRef={listContentRef}
              selectedIndexRef={selectedIndexRef}
              setActiveIndexFast={setActiveIndexFast}
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
