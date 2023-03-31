import { getFontSize } from '@tamagui/font-size'
import { getSize } from '@tamagui/get-size'
import { useGetThemedIcon } from '@tamagui/helpers-tamagui'
import { ThemeableStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import {
  GetProps,
  Theme,
  composeEventHandlers,
  getVariableValue,
  styled,
  useTheme,
} from '@tamagui/web'
import * as React from 'react'

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle'

type TamaguiButtonElement = HTMLButtonElement

type ToggleElement = TamaguiButtonElement

const ToggleFrame = styled(ThemeableStack, {
  name: NAME,

  variants: {
    unstyled: {
      false: {
        backgroundColor: '$background',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderColor: '$borderColor',
        padding: '$2',
        borderWidth: '$0.25',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        focusStyle: {
          outlineWidth: '$1',
          outlineStyle: 'solid',
          outlineOffset: `-2px`,
          outlineColor: '$color',
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
    size: {
      '...size': (value) => {
        const size = getVariableValue(getSize(value)) * 0.65
        return {
          width: size,
          height: size,
        }
      },
    },
  } as const,
  defaultVariants: {
    unstyled: false,
  },
})

type ToggleProps = GetProps<typeof ToggleFrame> & {
  defaultValue?: string
  disabled?: boolean
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?(pressed: boolean): void
}

const Toggle = ToggleFrame.extractable(
  React.forwardRef<ToggleElement, ToggleProps>((props, forwardedRef) => {
    const {
      children: childrenProp,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      size,
      ...buttonProps
    } = props

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
    })

    const iconSize = (typeof size === 'number' ? size * 0.65 : getFontSize(size)) * 1
    const theme = useTheme()
    const getThemedIcon = useGetThemedIcon({ size: iconSize, color: theme.color })

    const childrens = React.Children.toArray(childrenProp)
    const children = childrens.map((child) => {
      if (!React.isValidElement(child)) {
        return child
      }
      return getThemedIcon(child)
    })

    return (
      <Theme forceClassName name={pressed ? 'active' : null}>
        <ToggleFrame
          aria-pressed={pressed}
          data-state={pressed ? 'on' : 'off'}
          data-disabled={props.disabled ? '' : undefined}
          {...buttonProps}
          ref={forwardedRef}
          onPress={composeEventHandlers(props.onPress, () => {
            if (!props.disabled) {
              setPressed(!pressed)
            }
          })}
          onKeyDown={composeEventHandlers(
            (props as React.HTMLProps<HTMLButtonElement>).onKeyDown,
            (event) => {
              if ([' ', 'Enter'].includes(event.key)) {
                if (!props.disabled) {
                  setPressed(!pressed)
                }
              }
            }
          )}
        >
          {children}
        </ToggleFrame>
      </Theme>
    )
  })
)
Toggle.displayName = NAME

/* ---------------------------------------------------------------------------------------------- */

export { Toggle }
export type { ToggleProps }
