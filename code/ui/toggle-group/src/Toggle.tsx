import { createRefComponent } from '@tamagui/compose-refs'
import { composeEventHandlers } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import type { GetProps, StylePiece, TamaguiElement } from '@tamagui/web'
import { styled, View } from '@tamagui/web'
import * as React from 'react'
import { context } from './context'

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

// Unstyled Toggle behavior frame: structural layout, the native button
// render, and focus reset only. Hit-target dimensions live in the tamagui skin
// (code/ui/tamagui/src/components/ToggleGroup.tsx). All theme decoration
// (palette, border, hover/press/focus color styling) and the default "active"
// appearance live there too. The frame still emits the discrete state
// (aria-pressed / data-state) via the Toggle component below; the skins can
// supply a plain style prop object that is applied while active.
export const ToggleFrame = styled(View, {
  displayName: NAME,
  render: 'button',
  context,
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    defaultActiveStyle: {
      true: {},
    },
  } as const,
})

type ToggleFrameProps = GetProps<typeof ToggleFrame>

type ToggleItemExtraProps = {
  orientation?: 'horizontal' | 'vertical'
  defaultValue?: string
  disabled?: boolean
  active?: boolean
  defaultActive?: boolean
  onActiveChange?(active: boolean): void
  activeStyle?: StylePiece | null
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
        theme={active ? (activeTheme ?? null) : null}
        aria-pressed={active}
        data-state={active ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        {...(active && !activeStyle && { defaultActiveStyle: true })}
        {...buttonProps}
        style={[buttonProps.style, active && activeStyle]}
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
