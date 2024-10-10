// import './wdyr'

import { View as RNView } from 'react-native'
import { createStyledContext, styled, Text, View, withStaticProperties } from 'tamagui'

// const height = 32

// const context = createStyledContext<{ loading?: boolean }>({
//   loading: false,
// })

// const borderWidth = 2

// const Frame = styled(View, {
//   px: '$2',
//   height,
//   bg: '$color3',
//   bw: borderWidth,
//   bc: '$color6',
//   hoverStyle: {
//     bg: '$color4',
//   },
//   context,
//   variants: {
//     loading: {
//       true: {
//         cursor: 'not-allowed',
//         opacity: 0.5,
//       },
//       false: {
//         opacity: 1,
//       },
//     },
//   } as const,
//   jc: 'center',
//   tag: 'button',
//   br: 6,
//   defaultVariants: {
//     loading: false,
//   },
// })

// const ButtonFrame = Frame.styleable<{ loading?: boolean }>((props) => {
//   const { children, ...rest } = props

//   return (
//     <Frame
//       {...rest}
//       disabled={props.disabled || props.loading || false}
//       loading={props.loading || false}
//     >
//       {children}
//     </Frame>
//   )
// })

// export const ButtonText = styled(Text, {
//   context,
//   userSelect: 'none',
//   debug: 'verbose',

//   variants: {
//     loading: {
//       true: {
//         backgroundColor: 'red',
//         opacity: 0,
//       },
//       false: {
//         backgroundColor: 'blue',
//         opacity: 1,
//       },
//     },
//   } as const,

//   defaultVariants: {
//     loading: false,
//   },
// })

// export const Button = withStaticProperties(ButtonFrame, {
//   Text: ButtonText,
// })

const StyledText = styled(Text)
const TestComponent = () => <StyledText>TEST</StyledText>

export const Sandbox = () => {
  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      <TestComponent />

      {/* <Button loading>
        <Button.Text>hello world</Button.Text>
      </Button> */}

      {/* <Button loading={false}>
        <Button.Text>hello world</Button.Text>
      </Button> */}

      {/* <Paragraph
        debug="verbose"
        ov="hidden"
        fos="$5"
        px="$2"
        py="$1"
        col="$blue10"
        bg="$blue5"
        br="$3"
      >
        hello world2
      </Paragraph>

      <Text
        style={{
          borderRadius: 20,
          backgroundColor: 'red',
        }}
      >
        hello world
      </Text> */}

      {/* <Text debug="verbose" fow="bold">
        with bold2
      </Text> */}

      {/* <HOCMyView testProp={true} /> */}

      {/* <Test />

      <StyledImage
        width={30}
        height={30}
        src="https://akittenplace.org/wp-content/uploads/2019/10/kitten4.jpg"
      /> */}

      {/* <Demo3 /> */}
      {/* <Circle
        size={100}
        bg="red"
        animation="bouncy"
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      /> */}

      {/* <Grid debug="verbose" w={200} h={200} bg="red" /> */}

      {/* group animatable defaults */}
      {/* <YStack group="testy" w={400} h={400} bg="red">
        <YStack
          animation="quick"
          w={100}
          h={200}
          bg="yellow"
          $group-testy-hover={{
            x: -24,
          }}
        ></YStack>
      </YStack> */}

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

// const Grid = styled(YStack, {
//   '$platform-web': {
//     display: 'grid',
//     gridColumn: 'span 2',
//     gridRow: 'span 4',
//     gap: 32,
//   },

//   // $lg: {
//   //   // @ts-expect-error TODO
//   //   '$platform-web': {
//   //     gridColumn: 'span 4',
//   //     gridRow: 'span 1',
//   //   },
//   // },
// })

// type CheckboxSize = 'big' | 'default'

// type CheckboxContext = {
//   size?: CheckboxSize
//   checked: boolean
//   invalid?: boolean
//   disabled?: boolean
// }

// const CheckboxContext = createStyledContext<CheckboxContext>({
//   size: 'big',
//   checked: false,
//   invalid: false,
//   disabled: false,
// })

// type CheckboxComponentExtraProps = {
//   children?: string | JSX.Element
//   error?: string
//   onChange?: (checked: boolean) => void
// }

// const CheckboxFrame = styled(XStack, {
//   name: 'Checkbox',
//   context: CheckboxContext,

//   variants: {
//     size: {},

//     checked: {},

//     invalid: {},

//     disabled: {
//       true: {
//         pointerEvents: 'none',
//       },
//     },
//   } as const,
// })

// // When we use .styleable the context is loosing
// export const CheckboxComponent = CheckboxFrame.styleable<CheckboxComponentExtraProps>(
//   (props, ref) => {
//     const { children, error, onChange, ...rest } = props

//     const context = CheckboxContext.useStyledContext()

//     console.log('context', context)

//     return null
//   }
// )

// const StyledImage = styled(Image, {
//   margin: 10,
//   scale: 4,
// })

// const Test = styled(View, {
//   width: 100,
//   height: 100,
//   backgroundColor: 'red',
//   debug: 'verbose',

//   '$platform-native': {
//     backgroundColor: 'yellow',
//   },

//   $gtXs: {
//     '$platform-web': {
//       backgroundColor: 'green',
//     },
//   },

//   $xl: {
//     '$platform-native': {
//       backgroundColor: 'blue',
//     },
//   },
// })

// const ctx = createStyledContext({
//   testProp: false,
// })

// const MyView = styled(View, {
//   context: ctx,

//   variants: {
//     testProp: {
//       true: {},
//       false: {},
//     },
//   } as const,
// })

// const HOCMyView = MyView.styleable((props, ref) => {
//   console.log('what is', ctx.useStyledContext())

//   return <MyView {...props} />
// })
