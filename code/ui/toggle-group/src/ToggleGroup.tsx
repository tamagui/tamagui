import { isWeb } from '@tamagui/constants'
import { registerFocusable } from '@tamagui/focusable'
import { withStaticProperties } from '@tamagui/helpers'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import type { GetProps, TamaguiElement } from '@tamagui/web'
import { createStyledContext, styled, View } from '@tamagui/web'
import React from 'react'

import type { ToggleProps } from './Toggle'
import { Toggle, ToggleFrame } from './Toggle'
import { context as ToggleContext } from './context'

const TOGGLE_GROUP_NAME = 'ToggleGroup'
const TOGGLE_GROUP_ITEM_NAME = 'ToggleGroupItem'
const TOGGLE_GROUP_CONTEXT = 'ToggleGroup'

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemContextValue = { disabled?: boolean }

const { Provider: ToggleGroupItemProvider } =
  createStyledContext<ToggleGroupItemContextValue>()

const { Provider: ToggleGroupContext, useStyledContext: useToggleGroupContext } =
  createStyledContext<ToggleGroupContextValue>({})

type ToggleGroupItemProps = GetProps<typeof ToggleFrame> & {
  value: string
  id?: string
  disabled?: boolean
}

const ToggleGroupItem = ToggleFrame.styleable<ScopedProps<ToggleGroupItemProps>>(
  (props, forwardedRef) => {
    const valueContext = useToggleGroupValueContext(props.__scopeToggleGroup)
    const context = useToggleGroupContext(props.__scopeToggleGroup)
    const toggleContext = ToggleContext.useStyledContext(props.__scopeToggleGroup)
    const active = valueContext?.value.includes(props.value)
    const color = (props as any).color || toggleContext.color
    const disabled = context.disabled || props.disabled || false

    const inner = (
      <ToggleGroupItemImpl
        ref={forwardedRef}
        tabIndex={disabled ? -1 : 0}
        {...(props as any)}
        active={active}
        disabled={disabled}
      />
    )

    return (
      <ToggleGroupItemProvider scope={props.__scopeToggleGroup}>
        <ToggleContext.Provider color={color} active={active}>
          {context.rovingFocus ? (
            <RovingFocusGroup.Item
              asChild="except-style"
              __scopeRovingFocusGroup={props.__scopeToggleGroup || TOGGLE_GROUP_CONTEXT}
              focusable={!disabled}
              active={active}
            >
              {inner}
            </RovingFocusGroup.Item>
          ) : (
            inner
          )}
        </ToggleContext.Provider>
      </ToggleGroupItemProvider>
    )
  }
)
ToggleGroupItem.displayName = TOGGLE_GROUP_ITEM_NAME

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplProps = Omit<ToggleProps, 'defaultActive' | 'onActiveChange'> & {
  value: string
}

const ToggleGroupItemImpl = React.forwardRef<
  TamaguiElement,
  ScopedProps<ToggleGroupItemImplProps>
>((props, forwardedRef) => {
  const { __scopeToggleGroup, value, ...itemProps } = props
  const valueContext = useToggleGroupValueContext(__scopeToggleGroup)
  const singleProps = { 'aria-pressed': undefined }
  const typeProps = valueContext.type === 'single' ? singleProps : undefined

  return (
    <Toggle
      {...typeProps}
      {...itemProps}
      ref={forwardedRef}
      onActiveChange={(pressed) => {
        if (pressed) {
          valueContext.onItemActivate(value)
        } else {
          valueContext.onItemDeactivate(value)
        }
      }}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopeToggleGroup?: string }

interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
  type: 'single'
}

interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
  type: 'multiple'
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

const ToggleGroup = withStaticProperties(
  React.forwardRef<TamaguiElement, ScopedProps<ToggleGroupProps>>(
    (props, forwardedRef) => {
      const { type, ...toggleGroupProps } = props

      if (!isWeb) {
        React.useEffect(() => {
          if (!props.id) return
          return registerFocusable(props.id, {
            focus: () => {},
          })
        }, [props.id])
      }

      if (type === 'single') {
        const singleProps = toggleGroupProps as ToggleGroupImplSingleProps
        return <ToggleGroupImplSingle {...singleProps} ref={forwardedRef} />
      }

      if (type === 'multiple') {
        const multipleProps = toggleGroupProps as ToggleGroupImplMultipleProps
        return <ToggleGroupImplMultiple {...multipleProps} ref={forwardedRef} />
      }

      throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``)
    }
  ),
  {
    Item: ToggleGroupItem,
  }
)

ToggleGroup.displayName = TOGGLE_GROUP_NAME

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupValueContextValue = {
  type: 'single' | 'multiple'
  defaultValue?: string | string[]
  value: string[]
  onItemActivate(value: string): void
  onItemDeactivate(value: string): void
}

const {
  Provider: ToggleGroupValueProvider,
  useStyledContext: useToggleGroupValueContext,
} = createStyledContext<ToggleGroupValueContextValue>()

interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
  /** The controlled stateful value of the item that is pressed. */
  value?: string
  /** The value of the item that is pressed when initially rendered. */
  defaultValue?: string
  /** The callback that fires when the value of the toggle group changes. */
  onValueChange?(value: string): void
  /** Won't let the user turn the active item off. */
  disableDeactivation?: boolean
}

const ToggleGroupImplSingle = React.forwardRef<
  TamaguiElement,
  ScopedProps<ToggleGroupImplSingleProps>
>((props: ScopedProps<ToggleGroupImplSingleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    disableDeactivation = false,
    children,
    ...toggleGroupSingleProps
  } = props

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue!,
    onChange: onValueChange,
  })

  return (
    <ToggleGroupValueProvider
      scope={props.__scopeToggleGroup}
      type="single"
      value={value ? [value] : []}
      defaultValue={value}
      onItemActivate={setValue}
      onItemDeactivate={React.useCallback(
        () => (disableDeactivation ? null : setValue('')),
        [setValue, disableDeactivation]
      )}
    >
      <ToggleGroupImpl {...toggleGroupSingleProps} ref={forwardedRef}>
        {children}
      </ToggleGroupImpl>
    </ToggleGroupValueProvider>
  )
})

interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
  /** The controlled stateful value of the items that are pressed. */
  value?: string[]
  /** The value of the items that are pressed when initially rendered. */
  defaultValue?: string[]
  /** The callback that fires when the state of the toggle group changes. */
  onValueChange?(value: string[]): void
  disableDeactivation?: never
}

const ToggleGroupImplMultiple = React.forwardRef<
  TamaguiElement,
  ToggleGroupImplMultipleProps
>((props: ScopedProps<ToggleGroupImplMultipleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    disableDeactivation,
    children,
    ...toggleGroupMultipleProps
  } = props

  const [value = [], setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue!,
    onChange: onValueChange,
  })

  const handleButtonActivate = React.useCallback(
    (itemValue: string) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  )

  const handleButtonDeactivate = React.useCallback(
    (itemValue: string) =>
      setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
    [setValue]
  )

  return (
    <ToggleGroupValueProvider
      scope={props.__scopeToggleGroup}
      type="multiple"
      value={value}
      defaultValue={value}
      onItemActivate={handleButtonActivate}
      onItemDeactivate={handleButtonDeactivate}
    >
      <ToggleGroupImpl {...toggleGroupMultipleProps} ref={forwardedRef}>
        {children}
      </ToggleGroupImpl>
    </ToggleGroupValueProvider>
  )
})

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupContextValue = {
  rovingFocus?: boolean
  disabled?: boolean
}

type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>

const ToggleGroupFrame = styled(View, {
  name: TOGGLE_GROUP_NAME,
})

type ToggleGroupImplProps = GetProps<typeof ToggleGroupFrame> & {
  orientation?: 'horizontal' | 'vertical'
  rovingFocus?: boolean
  dir?: RovingFocusGroupProps['dir']
  loop?: RovingFocusGroupProps['loop']
  color?: string
}

const ToggleGroupImpl = ToggleGroupFrame.styleable<TamaguiElement, ToggleGroupImplProps>(
  (props: ScopedProps<ToggleGroupImplProps>, forwardedRef) => {
    const {
      __scopeToggleGroup,
      disabled = false,
      orientation = 'horizontal',
      dir,
      rovingFocus = true,
      loop = true,
      color,
      ...toggleGroupProps
    } = props
    const direction = useDirection(dir)

    const content = (
      <ToggleGroupFrame
        role="group"
        ref={forwardedRef}
        data-disabled={disabled ? '' : undefined}
        {...toggleGroupProps}
      />
    )

    return (
      <ToggleGroupContext
        scope={__scopeToggleGroup}
        rovingFocus={rovingFocus}
        disabled={disabled}
      >
        <ToggleContext.Provider color={color}>
          {rovingFocus ? (
            <RovingFocusGroup
              asChild="except-style"
              __scopeRovingFocusGroup={__scopeToggleGroup || TOGGLE_GROUP_CONTEXT}
              orientation={orientation}
              dir={direction}
              loop={loop}
            >
              {content}
            </RovingFocusGroup>
          ) : (
            content
          )}
        </ToggleContext.Provider>
      </ToggleGroupContext>
    )
  }
)

export { ToggleGroup }
export type {
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupProps,
  ToggleGroupSingleProps,
}
