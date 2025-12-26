import { composeEventHandlers } from '@tamagui/helpers'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, TamaguiElement } from '@tamagui/web'
import { createStyledContext, styled, Text } from '@tamagui/web'
import * as React from 'react'

export const context = createStyledContext({
  color: '',
  toggledStyle: null as null | Record<string, any>,
})

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

export const ToggleFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'button',
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

    active: {
      true: (_, { props, context }: any) => {
        const toggledStyle = context?.toggledStyle
        return {
          zIndex: 1,
          ...(!props.unstyled &&
            !toggledStyle && {
              backgroundColor: '$background',
              hoverStyle: {
                backgroundColor: '$background',
              },
              focusStyle: {
                backgroundColor: '$background',
                borderColor: '$borderColor',
              },
            }),
          ...toggledStyle,
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
  toggledStyle?: Record<string, any>
}

export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps

export const Toggle = React.forwardRef<TamaguiElement, ToggleProps>(
  function Toggle(props, forwardedRef) {
    const {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      ...buttonProps
    } = props

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
    })

    return (
      <ToggleFrame
        {...(!props.unstyled && {
          theme: pressed ? 'active' : null,
          themeShallow: true,
        })}
        active={pressed}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
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
