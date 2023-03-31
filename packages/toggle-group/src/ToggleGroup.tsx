import { Scope, createContextScope } from '@tamagui/create-context'
import { registerFocusable } from '@tamagui/focusable'
import { Group, GroupProps, useGroupItem } from '@tamagui/group'
import { RovingFocusGroup, createRovingFocusGroupScope } from '@tamagui/roving-focus'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import { GetProps, SizeTokens, isWeb, styled, withStaticProperties } from '@tamagui/web'
import React from 'react'

import { Toggle } from './Toggle'

const TOGGLE_GROUP_NAME = 'ToggleGroup'
const [createToggleGroupContext, createToggleGroupScope] = createContextScope(
  TOGGLE_GROUP_NAME,
  [createRovingFocusGroupScope]
)
/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_ITEM_NAME = 'ToggleGroupItem'

type ToggleGroupItemContextValue = { disabled?: boolean }

const [createToggleGroupItemContext, createToggleGroupItemScope] =
  createContextScope(TOGGLE_GROUP_ITEM_NAME)
const [ToggleGroupItemProvider, useToggleGroupItemContext] =
  createToggleGroupContext<ToggleGroupItemContextValue>(TOGGLE_GROUP_NAME)
const useToggleGroupItemScope = createToggleGroupItemScope()

const ToggleGroupItemFrame = styled(ThemeableStack, {
  name: TOGGLE_GROUP_ITEM_NAME,
})

type ToggleGroupItemElement = ToggleGroupItemImplElement

type ToggleGroupItemProps = GetProps<typeof ToggleGroupItemFrame> & {
  value: string
  id?: string
  disabled?: boolean
  size?: SizeTokens
}
const ToggleGroupItem = ToggleGroupItemFrame.extractable(
  React.forwardRef<ToggleGroupItemElement, ToggleGroupItemProps>(
    (props: ScopedProps<ToggleGroupItemProps>, forwardedRef) => {
      const valueContext = useToggleGroupValueContext(
        TOGGLE_GROUP_ITEM_NAME,
        props.__scopeToggleGroup
      )
      const context = useToggleGroupContext(
        TOGGLE_GROUP_ITEM_NAME,
        props.__scopeToggleGroup
      )
      const __scopeToggleGroup = props.__scopeToggleGroup
      const rovingFocusGroupScope = useRovingFocusGroupScope(props.__scopeToggleGroup)
      const pressed = valueContext.value.includes(props.value)
      const disabled = context.disabled || props.disabled || false
      const commonProps = { ...props, pressed, disabled }
      const ref = React.useRef<HTMLDivElement>(null)
      const groupItemProps = useGroupItem({ disabled })

      return (
        <ToggleGroupItemProvider scope={__scopeToggleGroup}>
          {context.rovingFocus ? (
            <RovingFocusGroup.Item
              asChild
              {...rovingFocusGroupScope}
              focusable={!disabled}
              active={pressed}
            >
              <ToggleGroupItemFrame
                asChild
                focusable={!disabled}
                disabled={disabled}
                ref={ref}
                {...groupItemProps}
              >
                <ToggleGroupItemImpl
                  size={props.size}
                  {...commonProps}
                  ref={forwardedRef}
                />
              </ToggleGroupItemFrame>
            </RovingFocusGroup.Item>
          ) : (
            <ToggleGroupItemFrame
              asChild
              focusable={!disabled}
              disabled={disabled}
              ref={ref}
            >
              <ToggleGroupItemImpl
                size={props.size}
                {...commonProps}
                ref={forwardedRef}
              />
            </ToggleGroupItemFrame>
          )}
        </ToggleGroupItemProvider>
      )
    }
  )
)
ToggleGroupItem.displayName = TOGGLE_GROUP_ITEM_NAME

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplElement = React.ElementRef<typeof Toggle>
type ToggleProps = React.ComponentPropsWithoutRef<typeof Toggle>
interface ToggleGroupItemImplProps
  extends Omit<ToggleProps, 'defaultPressed' | 'onPressedChange'> {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: string
  size?: SizeTokens
}

const ToggleGroupItemImpl = ToggleGroupItemFrame.extractable(
  React.forwardRef<ToggleGroupItemImplElement, ToggleGroupItemImplProps>(
    (props: ScopedProps<ToggleGroupItemImplProps>, forwardedRef) => {
      const { __scopeToggleGroup, value, ...itemProps } = props
      const valueContext = useToggleGroupValueContext(
        TOGGLE_GROUP_ITEM_NAME,
        __scopeToggleGroup
      )
      const singleProps = {
        'aria-pressed': undefined,
      }
      const typeProps = valueContext.type === 'single' ? singleProps : undefined
      const context = useToggleGroupContext(
        TOGGLE_GROUP_ITEM_NAME,
        props.__scopeToggleGroup
      )
      const size = props.size ?? context.size
      return (
        <Toggle
          {...typeProps}
          {...itemProps}
          size={size}
          ref={forwardedRef}
          onPressedChange={(pressed) => {
            if (pressed) {
              valueContext.onItemActivate(value)
            } else {
              valueContext.onItemDeactivate(value)
            }
          }}
        />
      )
    }
  )
)

/* -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

type ScopedProps<P> = P & { __scopeToggleGroup?: Scope }

const useRovingFocusGroupScope = createRovingFocusGroupScope()

type ToggleGroupElement = ToggleGroupImplSingleElement | ToggleGroupImplMultipleElement
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
  type: 'single'
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
  type: 'multiple'
}

const ToggleGroup = withStaticProperties(
  React.forwardRef<ToggleGroupElement, ToggleGroupSingleProps | ToggleGroupMultipleProps>(
    (props, forwardedRef) => {
      const { type, ...toggleGroupProps } = props

      if (!isWeb) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          if (!props.id) return
          return registerFocusable(props.id, {
            // TODO: would be nice to focus on the first child later - could be done with reforest
            // for now leaving it empty
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

const [ToggleGroupValueProvider, useToggleGroupValueContext] =
  createToggleGroupContext<ToggleGroupValueContextValue>(TOGGLE_GROUP_NAME)

type ToggleGroupImplSingleElement = ToggleGroupImplElement
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
  /**
   * The controlled stateful value of the item that is pressed.
   */
  value?: string
  /**
   * The value of the item that is pressed when initially rendered. Use
   * `defaultValue` if you do not need to control the state of a toggle group.
   */
  defaultValue?: string
  /**
   * The callback that fires when the value of the toggle group changes.
   */
  onValueChange?(value: string): void
}

const ToggleGroupImplSingle = React.forwardRef<
  ToggleGroupImplSingleElement,
  ToggleGroupImplSingleProps
>((props: ScopedProps<ToggleGroupImplSingleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
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
      onItemDeactivate={React.useCallback(() => setValue(''), [setValue])}
    >
      <ToggleGroupImpl {...toggleGroupSingleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  )
})

type ToggleGroupImplMultipleElement = ToggleGroupImplElement
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
  /**
   * The controlled stateful value of the items that are pressed.
   */
  value?: string[]
  /**
   * The value of the items that are pressed when initially rendered. Use
   * `defaultValue` if you do not need to control the state of a toggle group.
   */
  defaultValue?: string[]
  /**
   * The callback that fires when the state of the toggle group changes.
   */
  onValueChange?(value: string[]): void
}

const ToggleGroupImplMultiple = React.forwardRef<
  ToggleGroupImplMultipleElement,
  ToggleGroupImplMultipleProps
>((props: ScopedProps<ToggleGroupImplMultipleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
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
      <ToggleGroupImpl {...toggleGroupMultipleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  )
})

ToggleGroup.displayName = TOGGLE_GROUP_NAME

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupContextValue = {
  rovingFocus: boolean
  disabled: boolean
  size: SizeTokens
}

const [ToggleGroupContext, useToggleGroupContext] =
  createToggleGroupContext<ToggleGroupContextValue>(TOGGLE_GROUP_NAME)

type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup>
type TamaguiElement = HTMLElement
type ToggleGroupImplElement = TamaguiElement

const ToggleGroupImplElementFrame = styled(Group, {
  name: TOGGLE_GROUP_NAME,
  backgroundColor: '$background',
  variants: {
    orientation: {
      vertical: {
        flexDirection: 'column',
        spaceDirection: 'vertical',
      },
      horizontal: {
        flexDirection: 'row',
        spaceDirection: 'horizontal',
      },
    },
  } as const,
})

type ToggleGroupImplProps = GetProps<typeof ToggleGroupImplElementFrame> &
  GroupProps & {
    disabled?: boolean
    orientation?: RovingFocusGroupProps['orientation']
    rovingFocus?: boolean
    dir?: RovingFocusGroupProps['dir']
    loop?: RovingFocusGroupProps['loop']
  }

const ToggleGroupImpl = ToggleGroupImplElementFrame.extractable(
  React.forwardRef<ToggleGroupImplElement, ToggleGroupImplProps>(
    (props: ScopedProps<ToggleGroupImplProps>, forwardedRef) => {
      const {
        __scopeToggleGroup,
        disabled = false,
        orientation = 'horizontal',
        dir,
        rovingFocus = true,
        loop = true,
        size,
        ...toggleGroupProps
      } = props
      const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup)
      const direction = useDirection(dir)
      const commonProps = {
        role: 'togglegroup',
        dir: direction,
        size,
        ...toggleGroupProps,
      }
      return (
        <ToggleGroupContext
          scope={__scopeToggleGroup}
          rovingFocus={rovingFocus}
          disabled={disabled}
          size={size}
        >
          {rovingFocus ? (
            <RovingFocusGroup
              asChild
              {...rovingFocusGroupScope}
              orientation={orientation}
              dir={direction}
              loop={loop}
            >
              <ToggleGroupImplElementFrame
                aria-orientation={orientation}
                orientation={orientation}
                axis={orientation}
                ref={forwardedRef}
                data-disabled={disabled ? '' : undefined}
                {...commonProps}
              />
            </RovingFocusGroup>
          ) : (
            <ToggleGroupImplElementFrame
              aria-orientation={orientation}
              ref={forwardedRef}
              orientation={orientation}
              data-disabled={disabled ? '' : undefined}
              {...commonProps}
            />
          )}
        </ToggleGroupContext>
      )
    }
  )
)

export { ToggleGroup, createToggleGroupScope }
export type { ToggleGroupItemProps, ToggleGroupMultipleProps, ToggleGroupSingleProps }

