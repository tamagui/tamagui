import { createRefComponent } from '@tamagui/compose-refs'
import { composeEventHandlers } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, TamaguiElement, ViewStyle } from '@tamagui/web'
import { resolveDefaultSizeToken, styled, View } from '@tamagui/web'
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
    size: true,
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
      zIndex: 10,
    },

    variants: {
      size: {
        number: (val) => ({
          width: val,
          height: val,
        }),
        Size: (val, { tokens }) => {
          if (!val) return
          const sizeToken = resolveDefaultSizeToken(val)
          return {
            width: tokens.size[sizeToken],
            height: tokens.size[sizeToken],
          }
        },
      },

      defaultActiveStyle: {
        true: {
          backgroundColor: '$backgroundPress',
          hoverStyle: {
            backgroundColor: '$backgroundPress',
          },
          focusStyle: {
            backgroundColor: '$backgroundPress',
          },
        },
      },
    } as const,
  },
  {
    accept: {
      activeStyle: 'style',
    } as const,
  }
)

type ToggleFrameProps = GetProps<typeof ToggleFrame>

type ToggleItemExtraProps = {
  orientation?: 'horizontal' | 'vertical'
  defaultValue?: string
  disabled?: boolean
  active?: boolean
  defaultActive?: boolean
  onActiveChange?(active: boolean): void
  activeStyle?: ViewStyle | null
  activeTheme?: string | null
}

export type ToggleProps = ToggleFrameProps & ToggleItemExtraProps

export const Toggle = createRefComponent<TamaguiElement, ToggleProps>(
  function Toggle(props, forwardedRef) {
    const {
      active: activeProp,
      activeStyle,
      defaultActive = false,
      onActiveChange,
      activeTheme,
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
        {...(active && !activeStyle && { defaultActiveStyle: true })}
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
