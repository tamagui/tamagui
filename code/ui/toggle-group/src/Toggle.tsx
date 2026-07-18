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

// Unstyled Toggle behavior frame: structural layout, the size mechanism
// (hit-target dimensions), the native button render, and focus reset only. All
// theme decoration (palette, border, hover/press/focus color styling) and the
// default "active" appearance live in the tamagui skin
// (code/ui/tamagui/src/components/ToggleGroup.tsx). The frame still emits the
// discrete state (aria-pressed / data-state) via the Toggle component below; the
// skin styles that state through the `activeStyle` prop.
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

      // structural placeholder for the default-active appearance; the skin fills
      // it in (or the `activeStyle` prop overrides it).
      defaultActiveStyle: {
        true: {},
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
