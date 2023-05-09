import * as HeadlessButton from '@tamagui/button/headless'
import { ReactComponentWithRef, TamaguiElement, ThemeableProps } from '@tamagui/core'
import { getButtonSized } from '@tamagui/get-button-sized'
import { Activity, Airplay } from '@tamagui/lucide-icons'
import { IconProps } from '@tamagui/lucide-icons/types/IconProps'
import {
  ColorTokens,
  FontSizeTokens,
  GetProps,
  XGroup,
  XStack,
  YStack,
  getFontSize,
  styled,
  withStaticProperties,
} from 'tamagui'

const ButtonFrame = styled(HeadlessButton.ButtonFrame, {
  tag: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  cursor: 'pointer',
  hoverTheme: true,
  pressTheme: true,
  backgrounded: true,
  borderWidth: 1,
  borderColor: '$borderColor',

  pressStyle: {
    borderColor: '$borderColorPress',
  },

  focusStyle: {
    outlineColor: '$borderColorFocus',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  variants: {
    size: {
      '...size': getButtonSized,
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: '$background',
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
  } as const,
  defaultVariants: {
    size: '$true',
  },
})

const TextFrame = styled(HeadlessButton.ButtonTextFrame, {
  // ... your styles
})

/**
 * your own "composable" button
 */
const Button = withStaticProperties(
  ButtonFrame as ReactComponentWithRef<
    GetProps<typeof ButtonFrame> & ThemeableProps,
    TamaguiElement
  >,
  {
    Text: TextFrame,
    Icon: HeadlessButton.ButtonIcon,
  }
)

type SimpleButtonProps = GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    color?: ColorTokens
    icon?: React.NamedExoticComponent<IconProps>
    iconAfter?: React.NamedExoticComponent<IconProps>
  }
/**
 * your own "simple" button
 */
const SimpleButton = ButtonFrame.styleable<SimpleButtonProps>((props, ref) => {
  const { color, icon: Icon, iconAfter: IconAfter, size = '$3', ...buttonProps } = props
  const fontSize = getFontSize(size as FontSizeTokens)
  const iconSize = fontSize * 2

  return (
    <Button ref={ref} size={size} {...buttonProps}>
      {Icon && (
        <Button.Icon size={iconSize}>
          <Icon />
        </Button.Icon>
      )}
      <Button.Text color={color} size={props.size as FontSizeTokens}>
        {props.children}
      </Button.Text>
      {IconAfter && (
        <Button.Icon size={iconSize}>
          <IconAfter />
        </Button.Icon>
      )}
    </Button>
  )
})

export function ButtonHeadlessDemo(props) {
  return (
    <YStack padding="$3" space="$3" {...props}>
      <SimpleButton>Plain</SimpleButton>
      <SimpleButton alignSelf="center" size="$6" space="$3" icon={Airplay}>
        Large
      </SimpleButton>
      <XStack space="$2" justifyContent="center">
        <SimpleButton size="$3" theme="alt2">
          Alt2
        </SimpleButton>
        <SimpleButton size="$3" theme="yellow">
          Yellow
        </SimpleButton>
      </XStack>
      <XStack space="$2">
        <SimpleButton themeInverse size="$3">
          Small Inverse
        </SimpleButton>
        <SimpleButton size="$3" space="$1.5" iconAfter={Activity}>
          After
        </SimpleButton>
      </XStack>
      <XGroup>
        <XGroup.Item>
          <SimpleButton width="50%" size="$2" disabled>
            disabled
          </SimpleButton>
        </XGroup.Item>

        <XGroup.Item>
          <SimpleButton width="50%" size="$2" chromeless>
            chromeless
          </SimpleButton>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
