import { Adapt, AdaptParent, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { GetProps } from '@tamagui/core'
import {
  createChangeEventDetails,
  createStyledHOC,
  createStyledContext,
  styled,
  Text,
  View,
} from '@tamagui/core'
import { FocusScopeController } from '@tamagui/focus-scope'
import { registerFocusable } from '@tamagui/focusable'
import { withStaticProperties } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { ControllableStateSetter } from '@tamagui/use-controllable-state'
import * as React from 'react'
import {
  SelectItemParentProvider,
  SelectProvider,
  SelectZIndexContext,
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
import {
  createSelectItemRegistry,
  createSelectSelectionController,
  selectedValuesFromSelection,
  type SelectMode,
  type SelectSelection,
} from './selectionController'
import type {
  SelectActiveChangeDetails,
  SelectImplProps,
  SelectOpenChangeDetails,
  SelectProps,
  SelectScopedProps,
  SelectValueForMode,
  SelectValueChangeDetails,
} from './types'

export type SelectValue<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
> = SelectValueForMode<Value, Multiple>

/* -------------------------------------------------------------------------------------------------
 * SelectValue
 * -----------------------------------------------------------------------------------------------*/

const VALUE_NAME = 'SelectValue'

export const SelectValueFrame = styled(Text, {
  name: VALUE_NAME,
})

export type SelectValueExtraProps = SelectScopedProps<{
  placeholder?: React.ReactNode
}>

export type SelectValueProps = GetProps<typeof SelectValueFrame> & SelectValueExtraProps

export const SelectValue = createStyledHOC(SelectValueFrame)<SelectValueExtraProps>(
  function SelectValue(
    { scope, children: childrenProp, placeholder, ...props },
    forwardedRef
  ) {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)

    const composedRefs = useComposedRefs(
      // @ts-ignore react 19 ref type mismatch
      forwardedRef,
      context.onValueNodeChange as any
    )
    const isEmptyValue = context.selectedValues.length === 0

    // renderValue is synchronous for ssr and lazy item mounting
    const renderedValue =
      childrenProp === undefined ? context.renderValue?.(context.value) : undefined
    const registeredValue =
      context.mode === 'multiple'
        ? context.selectedValues.map((value, index) => (
            <React.Fragment key={value}>
              {index > 0 ? ', ' : null}
              {itemParentContext.registry.getItem(value)?.label ?? value}
            </React.Fragment>
          ))
        : (itemParentContext.registry.getItem(context.selectedValues[0])?.label ??
          context.value)
    const children =
      childrenProp !== undefined ? childrenProp : (renderedValue ?? registeredValue)
    const selectValueChildren = isEmptyValue ? (placeholder ?? children) : children

    return (
      <SelectValueFrame pointerEvents="none" ref={composedRefs} {...props}>
        {unwrapSelectItem(selectValueChildren)}
      </SelectValueFrame>
    )
  }
)

function unwrapSelectItem(selectValueChildren: any) {
  return React.Children.map(selectValueChildren, (child) => {
    if (child) {
      if (hasStaticConfigName(child.type?.staticConfig, ITEM_TEXT_NAME)) {
        return child.props.children
      }
      if (child.props?.children) {
        return unwrapSelectItem(child.props.children)
      }
    }
    return child
  })
}

function hasStaticConfigName(staticConfig: any, name: string): boolean {
  if (!staticConfig) return false
  if (staticConfig.componentName === name) return true
  return hasStaticConfigName(staticConfig.parentStaticConfig, name)
}

/* -------------------------------------------------------------------------------------------------
 * SelectIcon
 * -----------------------------------------------------------------------------------------------*/

export const SelectIcon = styled(View, {
  name: 'SelectIcon',
  // @ts-ignore
  'aria-hidden': true,
})

/* -------------------------------------------------------------------------------------------------
 * SelectItemIndicator
 * -----------------------------------------------------------------------------------------------*/

export const SelectItemIndicatorFrame = styled(View, {
  name: 'SelectItemIndicator',
})

export type SelectItemIndicatorProps = SelectScopedProps<
  GetProps<typeof SelectItemIndicatorFrame>
>

export const SelectItemIndicator = createStyledHOC(SelectItemIndicatorFrame)<{
  scope?: string
}>(function SelectItemIndicator(props, forwardedRef) {
  const { scope, ...itemIndicatorProps } = props
  const context = useSelectItemParentContext(scope)
  const itemContext = useSelectItemContext(scope)

  if (context.shouldRenderWebNative) {
    return null
  }

  return itemContext.isSelected ? (
    <SelectItemIndicatorFrame aria-hidden {...itemIndicatorProps} ref={forwardedRef} />
  ) : null
})

/* -------------------------------------------------------------------------------------------------
 * SelectIndicator
 * -----------------------------------------------------------------------------------------------*/

export const SelectIndicatorFrame = styled(View, {
  name: 'SelectIndicator',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  zIndex: 10,
})

export type SelectIndicatorProps = GetProps<typeof SelectIndicatorFrame>

export const SelectIndicator = createStyledHOC(SelectIndicatorFrame)<
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

export const SelectGroupFrame = styled(View, {
  name: GROUP_NAME,
})

const NativeSelectFrame = styled(Text, {
  name: 'NativeSelect',
  render: 'select',
})
const NativeSelect = NativeSelectFrame as any

type SelectGroupProps = SelectScopedProps<GetProps<typeof SelectGroupFrame>>

export const SelectGroup = createStyledHOC(SelectGroupFrame)<{ scope?: string }>(
  (props, forwardedRef) => {
    const { scope, ...groupProps } = props
    const groupId = React.useId()

    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)
    const nativeSelectRef = React.useRef<HTMLSelectElement>(null)

    const content = (() => {
      if (itemParentContext.shouldRenderWebNative) {
        return (
          <NativeSelect
            {...groupProps}
            // @ts-ignore it's ok since render="select"
            value={context.value}
            multiple={context.mode === 'multiple'}
            name={itemParentContext.name}
            form={itemParentContext.form}
            id={itemParentContext.id}
            onChange={
              ((event: React.ChangeEvent<HTMLSelectElement>) => {
                const value =
                  context.mode === 'multiple'
                    ? Array.from(
                        event.currentTarget.selectedOptions,
                        (option) => option.value
                      )
                    : event.currentTarget.value
                itemParentContext.changeNativeValue(value, event.nativeEvent)
              }) as any
            }
            ref={nativeSelectRef as any}
          >
            {props.children}
          </NativeSelect>
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

export const SelectLabelFrame = styled(Text, {
  name: LABEL_NAME,
})

export type SelectLabelProps = SelectScopedProps<GetProps<typeof SelectLabelFrame>>

export const SelectLabel = createStyledHOC(SelectLabelFrame)<{ scope?: any }>(
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
        {...labelProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SelectSeparator
 * -----------------------------------------------------------------------------------------------*/

export const SelectSeparator = styled(View, {
  name: 'SelectSeparator',
})

const SelectSheetImpl = (props: SelectImplProps) => {
  return <>{props.children}</>
}

/* -------------------------------------------------------------------------------------------------
 * Select
 * -----------------------------------------------------------------------------------------------*/

export function SelectRoot<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>(props: SelectScopedProps<SelectProps<Value, Multiple>>) {
  const adaptScope = `AdaptSelect${props.scope || ''}`

  // open state lives here (above AdaptParent) so the Adapt handoff can drive
  // the adapted Sheet's open/close and unmount timing directly, mirroring Dialog
  const [open, requestOpenChange] = useControllableState<
    boolean,
    SelectOpenChangeDetails
  >({
    prop: props.open,
    defaultProp: props.defaultOpen || false,
    onChange: props.onOpenChange as any,
  })

  const handleAdaptOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      requestOpenChange(
        nextOpen,
        createChangeEventDetails(
          nextOpen ? 'trigger-press' : 'outside-press'
        ) as SelectOpenChangeDetails
      )
    },
    [requestOpenChange]
  )

  return (
    <AdaptParent scope={adaptScope} open={open} onOpenChange={handleAdaptOpenChange}>
      <SelectInner
        {...(props as SelectScopedProps<SelectProps<string, boolean>>)}
        scope={props.scope}
        adaptScope={adaptScope}
        open={open}
        requestOpenChange={requestOpenChange}
      />
    </AdaptParent>
  )
}

export const Select = withStaticProperties(SelectRoot, {
  Root: SelectRoot,
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
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Viewport: SelectViewport,
  Indicator: SelectIndicator,
  FocusScope: FocusScopeController,
})

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

function SelectInner(
  props: SelectScopedProps<SelectProps<string, boolean>> & {
    adaptScope: string
    open: boolean
    requestOpenChange: ControllableStateSetter<boolean, SelectOpenChangeDetails>
  }
) {
  const {
    scope = '',
    adaptScope,
    native,
    children,
    open,
    requestOpenChange,
    defaultOpen: _defaultOpen,
    onOpenChange: _onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    multiple = false,
    name,
    form,
    disablePreventBodyScroll,
    size: sizeProp = true,
    onActiveChange,
    dir,
    id,
    renderValue,
    lazyMount,
    zIndex,
  } = props

  const isAdapted = useAdaptIsActive(adaptScope)
  const SelectImpl = isAdapted ? SelectSheetImpl : SelectInlineImpl
  const mode: SelectMode = multiple ? 'multiple' : 'single'

  const [valueState, requestValueChange] = useControllableState<
    SelectSelection,
    SelectValueChangeDetails
  >({
    prop: valueProp as SelectSelection | undefined,
    defaultProp: (defaultValue ?? (mode === 'multiple' ? [] : '')) as SelectSelection,
    onChange: onValueChange as any,
    transition: true,
  })

  const value = React.useMemo(
    () =>
      mode === 'multiple'
        ? selectedValuesFromSelection(mode, valueState)
        : typeof valueState === 'string'
          ? valueState
          : '',
    [mode, valueState]
  )
  const selectedValues = React.useMemo(
    () => selectedValuesFromSelection(mode, value),
    [mode, value]
  )

  const [, rerenderRegistry] = React.useReducer((version) => version + 1, 0)
  const registryRef = React.useRef<ReturnType<typeof createSelectItemRegistry> | null>(
    null
  )
  if (!registryRef.current) {
    registryRef.current = createSelectItemRegistry(rerenderRegistry)
  }
  const registry = registryRef.current

  const controllerRef = React.useRef<ReturnType<
    typeof createSelectSelectionController
  > | null>(null)
  if (!controllerRef.current) {
    controllerRef.current = createSelectSelectionController({
      mode,
      value,
      registry,
    })
  }
  const controller = controllerRef.current
  controller.setMode(mode)
  controller.setValue(value)

  React.useEffect(() => {
    if (process.env.TAMAGUI_TARGET !== 'native' || !props.id) return

    return registerFocusable(props.id, {
      focusAndSelect: () => {
        requestOpenChange(
          (current) => !current,
          createChangeEventDetails('trigger-press') as SelectOpenChangeDetails
        )
      },
      focus: () => {},
    })
  }, [props.id, requestOpenChange])

  // activeIndex is stored in a ref to avoid re-renders on every hover
  // we have two setters:
  // - setActiveIndexFast: updates ref + emits to subscribers (no re-render) - use for hover/navigation
  // - setActiveIndex: updates ref + emits + triggers re-render - use when UI needs to update
  // initialize to null so floating-ui starts from selectedIndex on first open
  const activeIndexRef = React.useRef<number | null>(null)
  const [activeIndex, setActiveIndexState] = React.useState<number | null>(null)

  const [emitActiveIndex, activeIndexSubscribe] = useEmitter<number>()

  const selectedIndexRef = React.useRef<number | null>(null)
  const listContentRef = React.useRef<string[]>([])
  const listRef = React.useRef<Array<HTMLElement | null>>([])
  const [valueNode, setValueNode] = React.useState<HTMLElement | null>(null)
  const selectedIndex = Math.max(0, controller.selectionAnchorIndex())
  listContentRef.current = registry.getTypeaheadLabels()
  listRef.current.length = registry.getItems().length

  // Intentionally dependency-less: selectedIndexRef mirrors every render for non-reactive reads.
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
    (index: number | null, details?: SelectActiveChangeDetails) => {
      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index
        controller.setActiveIndex(index)
        if (typeof index === 'number') {
          emitActiveIndex(index)
          const item = registry.getItems()[index]
          if (item && details) {
            onActiveChange?.(item.value, details)
          }
        }
      }
    },
    [controller, emitActiveIndex, onActiveChange, registry]
  )

  // slow setter: also triggers a re-render for components that need the state value
  // use this sparingly, e.g., when controlled scrolling needs to scroll item into view
  const setActiveIndex = React.useCallback(
    (index: number | null, details?: SelectActiveChangeDetails) => {
      setActiveIndexFast(index, details)
      setActiveIndexState(index)
    },
    [setActiveIndexFast]
  )

  const activeDetails = React.useCallback(
    (
      reason: SelectActiveChangeDetails['reason'],
      index: number,
      event?: Event
    ): SelectActiveChangeDetails => ({
      reason,
      event,
      trigger: undefined,
      index,
    }),
    []
  )

  const moveActive = React.useCallback(
    (direction: 1 | -1, event?: Event) => {
      const nextIndex = registry.nextEnabledIndex(activeIndexRef.current, direction)
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex, activeDetails('keyboard', nextIndex, event))
      }
    },
    [activeDetails, registry, setActiveIndex]
  )

  const typeaheadRef = React.useRef({ text: '', timeout: null as any })
  const search = React.useCallback(
    (text: string, event?: Event) => {
      clearTimeout(typeaheadRef.current.timeout)
      typeaheadRef.current.text += text
      let nextIndex = registry.findTypeaheadIndex(
        typeaheadRef.current.text,
        activeIndexRef.current
      )
      if (nextIndex < 0 && typeaheadRef.current.text.length > 1) {
        typeaheadRef.current.text = text
        nextIndex = registry.findTypeaheadIndex(text, activeIndexRef.current)
      }
      typeaheadRef.current.timeout = setTimeout(() => {
        typeaheadRef.current.text = ''
      }, 750)
      if (nextIndex >= 0) {
        setActiveIndex(nextIndex, activeDetails('keyboard', nextIndex, event))
      }
    },
    [activeDetails, registry, setActiveIndex]
  )

  React.useEffect(() => {
    return () => clearTimeout(typeaheadRef.current.timeout)
  }, [])

  React.useEffect(() => {
    if (open) {
      const anchorIndex = controller.selectionAnchorIndex()
      const nextIndex = anchorIndex >= 0 ? anchorIndex : registry.firstEnabledIndex()
      if (nextIndex >= 0) {
        setActiveIndexFast(nextIndex, activeDetails('list-navigation', nextIndex))
      }
    } else {
      setActiveIndexFast(null)
      setActiveIndexState(null)
    }
  }, [open, selectedIndex, registry.getItems().length])

  const selectValue = React.useCallback(
    (nextItemValue: string, details: SelectValueChangeDetails) => {
      const item = registry.getItem(nextItemValue)
      if (!item || item.disabled) return
      controller.setMode(mode)
      controller.setValue(value)
      const previousValue = controller.value
      const nextValue = controller.toggle(nextItemValue)
      requestValueChange(nextValue, details)
      if (details.isCanceled) {
        controller.setValue(previousValue)
        return
      }
      if (controller.shouldCloseOnSelect) {
        requestOpenChange(
          false,
          createChangeEventDetails(
            details.reason === 'keyboard' ? 'keyboard' : 'item-press',
            details.event,
            details.trigger
          ) as SelectOpenChangeDetails
        )
      }
    },
    [controller, mode, registry, requestOpenChange, requestValueChange, value]
  )

  const changeNativeValue = React.useCallback(
    (nextValue: SelectSelection, event: Event) => {
      const details = createChangeEventDetails(
        'native-change',
        event
      ) as SelectValueChangeDetails
      requestValueChange(nextValue, details)
      if (!details.isCanceled) {
        controller.setValue(nextValue)
      }
    },
    [controller, requestValueChange]
  )

  const content = (
    <SelectItemParentProvider
      scopeName={scope}
      scope={scope}
      adaptScope={adaptScope}
      mode={mode}
      selectedValues={selectedValues}
      registry={registry}
      size={sizeProp}
      activeIndexSubscribe={activeIndexSubscribe}
      activeIndexRef={activeIndexRef}
      requestOpenChange={requestOpenChange}
      id={id}
      name={name}
      form={form}
      selectValue={selectValue}
      changeNativeValue={changeNativeValue}
      shouldRenderWebNative={shouldRenderWebNative}
      setActiveIndexFast={setActiveIndexFast}
      listRef={listRef}
      moveActive={moveActive}
      search={search}
    >
      <SelectProvider
        scope={scope}
        scopeName={scope}
        adaptScope={adaptScope}
        disablePreventBodyScroll={disablePreventBodyScroll}
        dir={dir}
        blockSelection={false}
        fallback={false}
        valueNode={valueNode}
        onValueNodeChange={setValueNode}
        activeIndex={activeIndex}
        activeIndexRef={activeIndexRef}
        selectedIndex={selectedIndex}
        setActiveIndex={setActiveIndex}
        value={value}
        mode={mode}
        selectedValues={selectedValues}
        activeItem={
          activeIndex == null ? undefined : registry.getItems()[activeIndex]?.value
        }
        selectionAnchor={controller.selectionAnchor()?.value}
        open={open}
        native={native}
        renderValue={renderValue}
        lazyMount={lazyMount}
      >
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
      </SelectProvider>
      {isWeb && !shouldRenderWebNative && name
        ? (mode === 'multiple' ? selectedValues : [value as string]).map((inputValue) => (
            <input
              key={inputValue}
              type="hidden"
              name={name}
              form={form}
              value={inputValue}
            />
          ))
        : null}
    </SelectItemParentProvider>
  )

  if (zIndex !== undefined) {
    return (
      <SelectZIndexContext.Provider value={zIndex}>
        {content}
      </SelectZIndexContext.Provider>
    )
  }

  return content
}
