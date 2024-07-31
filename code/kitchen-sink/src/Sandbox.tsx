//! debug-verbose
import './wdyr'

import { Anchor, XStack, createStyledContext, styled, useMedia } from 'tamagui'
// import { DatePickerExample } from '../../bento/src/components/elements/datepickers/DatePicker'

import { View as RNView } from 'react-native'

const StyledAnchor = styled(Anchor)

export const Sandbox = () => {
  const media = useMedia()

  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      {/* <Demo3 /> */}
      {/* <Circle
        debug="verbose"
        size={100}
        bg="red"
        animation="bouncy"
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      /> */}

      {/* <SliderDemo /> */}

      {/* <StyledAnchor target="_blank" href="https://google.com">
        hello world
      </StyledAnchor> */}

      {/* <CheckboxComponent size="default" /> */}

      {/* <View
        w={100}
        h={100}
        enterStyle={media.lg ? {} : {}}
        background={media.sm ? 'red' : 'yellow'}
      /> */}

      {/* <DatePickerExample /> */}
    </RNView>
  )
}

type CheckboxSize = 'big' | 'default'

type CheckboxContext = {
  size?: CheckboxSize
  checked: boolean
  invalid?: boolean
  disabled?: boolean
}

const CheckboxContext = createStyledContext<CheckboxContext>({
  size: 'big',
  checked: false,
  invalid: false,
  disabled: false,
})

type CheckboxComponentExtraProps = {
  children?: string | JSX.Element
  error?: string
  onChange?: (checked: boolean) => void
}

const CheckboxFrame = styled(XStack, {
  name: 'Checkbox',
  context: CheckboxContext,

  variants: {
    size: {},

    checked: {},

    invalid: {},

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

// When we use .styleable the context is loosing
export const CheckboxComponent = CheckboxFrame.styleable<CheckboxComponentExtraProps>(
  (props, ref) => {
    const { children, error, onChange, ...rest } = props

    const context = CheckboxContext.useStyledContext()

    console.log('context', context)

    return null
  }
)
