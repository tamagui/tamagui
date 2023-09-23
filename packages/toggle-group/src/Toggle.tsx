import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { GetProps, Theme, composeEventHandlers, isWeb, styled } from '@tamagui/web'
import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

type TamaguiButtonElement = HTMLButtonElement

type ToggleElement = TamaguiButtonElement

const ToggleFrame = styled(ThemeableStack, {
  name: NAME,
  tag: 'button',

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
          outlineColor: '$borderColorFocus',
          outlineWidth: 2,
          outlineStyle: 'solid',
        },
      },
    },

    active: {
      true: {
        zIndex: 1,
        hoverStyle: {
          backgroundColor: '$background',
        },
        focusStyle: {
          borderColor: '$borderColorPress',
          backgroundColor: '$backgroundPress',
        },
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
    unstyled: false,
  },
})

type ToggleFrameProps = GetProps<typeof ToggleFrame>

type ToggleProps = ToggleFrameProps & {
  defaultValue?: string
  disabled?: boolean
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?(pressed: boolean): void
}

const Toggle = ToggleFrame.extractable(
  React.forwardRef<ToggleElement, ToggleProps>((props, forwardedRef) => {
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
        theme={pressed ? 'active' : null}
        themeShallow
        active={!props.unstyled ? pressed : undefined}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        {...buttonProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress ?? undefined, (event) => {
          if (!props.disabled) {
            setPressed(!pressed)
          }
        })}
        // caught by onPress - no need for this
        // {...(isWeb && {
        //   onKeyDown: composeEventHandlers(
        //     (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
        //     (event) => {
        //       if ([' ', 'Enter'].includes(event.key)) {
        //         if (!props.disabled) {
        //           setPressed(!pressed)
        //         }
        //       }
        //     }
        //   ),
        // })}
      />
    )
  })
)
Toggle.displayName = NAME

/* ---------------------------------------------------------------------------------------------- */

export { Toggle, ToggleFrame }
export type { ToggleProps }
