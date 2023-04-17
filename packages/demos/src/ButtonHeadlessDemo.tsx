import { Button as TamaguiButton } from '@tamagui/button/headless'
import { getButtonSized } from '@tamagui/get-button-sized'
import { Activity, Airplay } from '@tamagui/lucide-icons'
import {
  ColorTokens,
  FontSizeTokens,
  GetProps,
  XGroup,
  XStack,
  YStack,
  styled
} from 'tamagui'

const MyButton = styled(TamaguiButton, {
  tag: 'button',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  cursor: 'pointer',
  focusable: true,
  hoverTheme: true,
  pressTheme: true,
  backgrounded: true,
  borderWidth: 1,
  borderColor: 'transparent',

  pressStyle: {
    borderColor: 'transparent',
  },

  hoverStyle: {
    borderColor: 'transparent',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
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
      },
    },
  } as const,
})

const Button = (
  props: GetProps<typeof MyButton> & { color?: ColorTokens; icon?: JSX.Element }
) => {
  const { color, icon, ...buttonProps } = props

  return (
    <MyButton {...buttonProps}>
      {icon && <MyButton.Icon>{icon}</MyButton.Icon>}
      <MyButton.Text color={color} size={props.size as FontSizeTokens}>
        {props.children}
      </MyButton.Text>
    </MyButton>
  )
}

export function ButtonHeadlessDemo(props) {
  return (
    <YStack padding="$3" space="$3" {...props}>
      <Button>Plain</Button>
      <Button alignSelf="center" size="$6" space="$1" icon={<Airplay />}>
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
        <Button size="$3" space="$2" icon={<Activity />}>
          After
        </Button>
      </XStack>
      <XGroup>
        <XGroup.Item>
          <Button width="50%" size="$2" disabled opacity={0.5}>
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
