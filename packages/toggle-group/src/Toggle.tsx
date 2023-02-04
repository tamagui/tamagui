import { GetProps, composeEventHandlers, styled } from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

type TamaguiButtonElement = HTMLButtonElement

type ToggleElement = TamaguiButtonElement

const ToggleFrame = styled(ThemeableStack, {
  name: NAME,
  backgroundColor: '$background',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  borderColor: '$borderColor',
  padding: 5,
  borderWidth: 1,
  borderRadius: 4,
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  focusStyle: {
    outlineWidth: '2px',
    outlineStyle: 'auto',
  },
  variants: {
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
    press: {
      active: {
        backgroundColor: '$backgroundPress',
      },
      unactive: {
        backgroundColor: '$background',
      },
    },
  } as const,
})

type ToggleProps = GetProps<typeof ToggleFrame> & {
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?(pressed: boolean): void
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const Toggle = ToggleFrame.extractable(
  React.forwardRef<ToggleElement, ToggleProps>((props, forwardedRef) => {
    const {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      onClick,
      ...buttonProps
    } = props

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
    })

    return (
      <ToggleFrame
        press={pressed ? 'active' : 'unactive'}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => {
          if (!props.disabled) {
            setPressed(!pressed)
          }
        })}
      />
    )
  })
)
Toggle.displayName = NAME

/* ---------------------------------------------------------------------------------------------- */

export { Toggle }
export type { ToggleProps }
