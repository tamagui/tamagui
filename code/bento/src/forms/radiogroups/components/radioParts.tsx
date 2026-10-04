import type { ComponentSize } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import {
  getVariableValue,
  RadioGroup as TRadioGroup,
  styled,
  View,
  withStaticProperties,
  type SizeTokens,
} from 'tamagui'

// v3 ships RadioGroup unstyled, so bento carries the skin. Reproduces the v2
// RadioGroupItemFrame: a circle sized at half the size token, themed
// background, 1px border and the hover/press/focus states.
//
// withStaticProperties does an in-place Object.assign, so these have to be
// captured before the export below - otherwise wrapping the imported
// RadioGroup overwrites tamagui's own RadioGroup.Item for every consumer and
// the wrapper recurses into itself.
const BaseRadioGroupItem = TRadioGroup.Item
const BaseRadioGroupIndicator = TRadioGroup.Indicator

type RadioItemProps = React.ComponentProps<typeof BaseRadioGroupItem> & {
  scaleSize?: number
  size?: ComponentSize
}

function RadioGroupItem({ scaleSize = 0.5, ...props }: RadioItemProps) {
  const size = Math.floor(getVariableValue(getSize(props.size ?? true)) * scaleSize)
  return (
    <BaseRadioGroupItem
      width={size}
      height={size}
      borderRadius={1000}
      backgroundColor="background hover:background-hover press:background-focus focus:background-hover"
      items="center"
      justify="center"
      borderWidth={1}
      borderColor="border-color hover:border-color-hover press:border-color-focus focus:border-color-hover"
      p={0}
      outlineStyle="focus-visible:solid"
      outlineWidth="focus-visible:2px"
      outlineColor="focus-visible:outline-color"
      {...props}
    />
  )
}

function RadioGroupFrame(props: React.ComponentProps<typeof TRadioGroup>) {
  return <TRadioGroup {...props} />
}

export const RadioGroup = withStaticProperties(RadioGroupFrame, {
  Item: RadioGroupItem,
  Indicator: BaseRadioGroupIndicator,
})

export const Card = styled(View, {
  cursor: 'pointer',
  width: '100%',
  rounded: '4',
  p: '3',
  bg: 'background hover:background-hover focus:background-focus press:background-press',
  borderColor:
    'border-color hover:border-color-hover focus:border-color-focus press:border-color-press',
  borderWidth: 1,
  variants: {
    active: {
      true: {
        bg: 'background-focus',
        borderColor: 'border-color-focus',
      },
    },
  } as const,
})
