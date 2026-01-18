import { composeEventHandlers } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, TamaguiElement, ViewStyle } from '@tamagui/web'
import { styled, View } from '@tamagui/web'
import * as React from 'react'
import { context } from './context'

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

export const ToggleFrame = styled(
  View,
  {
    name: NAME,
    render: 'button',
    context,

    variants: {
      unstyled: {
        false: {
          size: '$true',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          backgroundColor: '$background',
          borderColor: '$borderColor',
          borderWidth: 1,
          margin: -1,
          hoverStyle: {
            backgroundColor: '$backgroundHover',
            borderColor: '$borderColorHover',
          },
          pressStyle: {
            backgroundColor: '$backgroundPress',
            borderColor: '$borderColorPress',
          },
          focusVisibleStyle: {
            outlineColor: '$outlineColor',
            outlineWidth: 2,
            outlineStyle: 'solid',
          },
        },
      },

      size: {
        '...size': (val, { tokens }) => {
          if (!val) return
          return {
            width: tokens.size[val],
            height: tokens.size[val],
          }
        },
      },

      defaultActiveStyle: {
        true: {
          backgroundColor: '$backgroundActive',
          hoverStyle: {
            backgroundColor: '$backgroundActive',
          },
          focusStyle: {
            backgroundColor: '$backgroundActive',
            borderColor: '$borderColorActive',
          },
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1',
    },
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)

type ToggleFrameProps = GetProps<typeof ToggleFrame>

type ToggleItemExtraProps = {
  defaultValue?: string
  disabled?: boolean
  active?: boolean
  defaultActive?: boolean
  onActiveChange?(active: boolean): void
  activeStyle?: ViewStyle | null
  activeTheme?: string | null
}

export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps

export const Toggle = React.forwardRef<TamaguiElement, ToggleProps>(
  function Toggle(props, forwardedRef) {
    const {
      active: activeProp,
      activeStyle,
      defaultActive = false,
      onActiveChange,
      activeTheme,
      unstyled = false,
      ...buttonProps
    } = props

    const [active = false, setActive] = useControllableState({
      prop: activeProp,
      onChange: onActiveChange,
      defaultProp: defaultActive,
    })

    return (
      <ToggleFrame
        theme={activeTheme ?? null}
        aria-pressed={active}
        data-state={active ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        unstyled={unstyled}
        {...(active &&
          !activeStyle &&
          !unstyled && {
            defaultActiveStyle: true,
          })}
        {...(active &&
          activeStyle && {
            ...(activeStyle as any),
            hoverStyle: activeStyle,
            focusStyle: activeStyle,
          })}
        {...buttonProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress ?? undefined, () => {
          if (!props.disabled) {
            setActive((prev) => !prev)
          }
        })}
      />
    )
  }
)

/* ---------------------------------------------------------------------------------------------- */
