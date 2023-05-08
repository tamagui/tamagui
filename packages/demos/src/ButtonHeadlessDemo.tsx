import { Button as HeadlessTamaguiButton } from '@tamagui/button/headless'
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
  themeable,
  useGetThemedIcon,
  withStaticProperties,
} from 'tamagui'

const ButtonFrame = styled(HeadlessTamaguiButton, {
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
})

const MyButton = withStaticProperties(ButtonFrame, {
  Text: ButtonFrame.Text,
  Icon: ButtonFrame.Icon,
})

type MyCustomProps = {
  color?: ColorTokens
  icon?: React.NamedExoticComponent<IconProps>
  iconAfter?: React.NamedExoticComponent<IconProps>
}

type ButtonProps = GetProps<typeof MyButton> & MyCustomProps

const Button = MyButton.styleable<ButtonProps>((props, ref) => {
  const { color, icon: Icon, iconAfter: IconAfter, size = '$3', ...buttonProps } = props
  const iconSize =
    typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)
  const getThemedIcon = useGetThemedIcon({ color, size: iconSize })
  return (
    <MyButton ref={ref} size={size} {...buttonProps}>
      {Icon && <MyButton.Icon>{getThemedIcon(Icon)}</MyButton.Icon>}
      <MyButton.Text color={color} size={props.size as FontSizeTokens}>
        {props.children}
      </MyButton.Text>
      {IconAfter && <MyButton.Icon>{getThemedIcon(IconAfter)}</MyButton.Icon>}
    </MyButton>
  )
})

export function ButtonHeadlessDemo(props) {
  return (
    <YStack padding="$3" space="$3" {...props}>
      <Button>Plain</Button>
      <Button alignSelf="center" size="$6" space="$3" icon={Airplay}>
        Large
      </Button>
      <XStack space="$2" justifyContent="center">
        <Button size="$3" theme="alt2">
          Alt2
        </Button>
        <Button size="$3" theme="yellow">
          Yellow
        </Button>
      </XStack>
      <XStack space="$2">
        <Button themeInverse size="$3">
          Small Inverse
        </Button>
        <Button size="$3" space="$1.5" iconAfter={Activity}>
          After
        </Button>
      </XStack>
      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$2" disabled>
            disabled
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="50%" size="$2" chromeless>
            chromeless
          </Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
