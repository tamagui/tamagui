import { composeEventHandlers } from '@tamagui/helpers'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, StackStyleBase, TamaguiElement } from '@tamagui/web'
import { createStyledContext, styled, Text } from '@tamagui/web'
import * as React from 'react'

export type ToggleStylesBase = StackStyleBase & { color?: string }

export const context = createStyledContext({
  color: '',
  activeStyle: null as null | ToggleStylesBase,
})

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

export const ToggleFrame = styled(ThemeableStack, {
  name: NAME,
  render: 'button',
  context,

  variants: {
    unstyled: {
      false: {
        pressTheme: true,
        backgroundColor: '$background',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderColor: '$borderColor',
        borderWidth: 1,
        margin: -1,
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
        focusStyle: {
          borderColor: '$borderColorFocus',
        },
        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineWidth: 2,
          outlineStyle: 'solid',
        },
      },
    },

    activeStyle: (val: ToggleStylesBase | null) => ({}),

    active: {
      true: (_, { props, context }: any) => {
        const activeStyle = props.activeStyle || context?.activeStyle
        return {
          zIndex: 1,
          ...(!props.unstyled &&
            !activeStyle && {
              backgroundColor: '$backgroundActive',
              hoverStyle: {
                backgroundColor: '$backgroundActive',
              },
              focusStyle: {
                backgroundColor: '$backgroundActive',
                borderColor: '$borderColor',
              },
            }),
          ...(activeStyle as object),
        }
      },
    },

    orientation: {
      horizontal: {
        flexDirection: 'row',
        spaceDirection: 'horizontal',
      },
      vertical: {
        flexDirection: 'column',
        spaceDirection: 'vertical',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type ToggleFrameProps = GetProps<typeof ToggleFrame>

type ToggleItemExtraProps = {
  defaultValue?: string
  disabled?: boolean
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?(pressed: boolean): void
  activeStyle?: ToggleStylesBase | null
  activeTheme?: string | null
}

export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps

export const Toggle = React.forwardRef<TamaguiElement, ToggleProps>(
  function Toggle(props, forwardedRef) {
    const {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      activeTheme,
      unstyled = false,
      activeStyle,
      ...buttonProps
    } = props

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
    })

    return (
      <ToggleFrame
        theme={activeTheme ?? null}
        active={pressed}
        activeStyle={activeStyle}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        unstyled={unstyled}
        {...buttonProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress ?? undefined, () => {
          if (!props.disabled) {
            setPressed((prev) => !prev)
          }
        })}
      />
    )
  }
)

/* ---------------------------------------------------------------------------------------------- */
