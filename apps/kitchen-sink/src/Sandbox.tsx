// import './wdyr'

import { Stack, createTheme } from '@tamagui/web'
import { forwardRef, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import {
  Button,
  Paragraph,
  SizableText,
  Square,
  TamaguiElement,
  Text,
  styled,
  useTheme,
  withStaticProperties,
} from 'tamagui'

export const MyButton = styled(Button, {
  name: 'MyButton',

  variants: {
    test: {
      true: {
        backgroundColor: 'yellow',
        pressStyle: {
          backgroundColor: 'red',
        },
      },
    },
  } as const,
})

export const Sandbox = () => {
  const theme = useTheme().color.val
  const ref = useRef<any>()

  useEffect(() => {
    console.log('ref', ref.current)
  }, [])

  return (
    <>
      <Stack ref={ref} f={1} group="testy">
        <Button> test a123</Button>
        <Square
          size={100}
          bc="green"
          // $group-testy={{
          //   bc: 'brown',
          // }}
          // $group-testy-hover={{
          //   bc: 'black',
          // }}
          $group-testy-sm={{
            bc: 'red',
          }}
          $group-testy-sm-hover={{
            bc: 'palegoldenrod',
          }}
        />
      </Stack>
      {/* 
      <Stack>
        <Square size={100} bc="yellow" $group-testy={{ bc: 'red' }} />
      </Stack> */}

      {/* <TextInput theme={theme} /> */}
      {/* <Button onPress={() => setTheme('red')}>asdsad</Button> */}

      {/* TODO REALLY NEED TO TEST THIS SORT OF STUFF ON NATIVE */}
      {/* <MyButton test>ok</MyButton> */}

      {/* <DrawListRow debug="verbose">
        <Square size={100} bc="red" />
      </DrawListRow> */}

      {/* <BenchmarkSelect /> */}

      {/* TODO test this one at diff sizes make sure:
    
      - font size is right at each size
      - textTransform + lineHeight too etc
    
    */}
      {/* <H1
        ta="left"
        size="$10"
        maw={500}
        h={130}
        // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
        $gtSm={{
          mx: 0,
          maxWidth: 800,
          size: '$13',
          h: 190,
          ta: 'center',
          als: 'center',
        }}
        $gtMd={{
          maxWidth: 900,
          size: '$14',
          h: 240,
        }}
        $gtLg={{
          size: '$16',
          lh: '$15',
          maxWidth: 1200,
          h: 290,
        }}
      >
        <span className="all ease-in ms250 rainbow clip-text">Write less,</span>
        <br />
        runs&nbsp;faster
      </H1> */}

      {/* <Subtitle debug="verbose">hello</Subtitle> */}
      {/* <Paragraph size="$15" pos="absolute" rotate="-10deg" ta="center" ff="$silkscreen">
        WATCH THE VIDEO
      </Paragraph> */}

      {/* <Button.Text fontWeight="900">test out</Button.Text> */}
      {/* <H2
        ff="$mono"
        size="$12"
        $lg={{
          size: '$9',
        }}
        $sm={{
          ff: '$mono',
          size: '$8',
        }}
      >
        test
      </H2> */}
      {/* <ChangeWeight>Default</ChangeWeight>
      <ChangeWeight weight="low">low</ChangeWeight>
      <ChangeWeight weight="high">high</ChangeWeight> */}
      {/* <ChangeFamilyVariant debug="verbose" size="$15">
        Test
      </ChangeFamilyVariant>
      <ChangeFamilyVariant size="$15" isHeading>
        Test
      </ChangeFamilyVariant> */}
    </>
  )
}

const ChangeWeight = styled(Text, {
  fontFamily: '$heading',
  fontWeight: '500',

  variants: {
    weight: {
      low: {
        fontWeight: '$1',
      },
      high: {
        fontWeight: '800',
      },
    },
  } as const,
})

// TODO test:

const ChangeFamilyVariant = styled(SizableText, {
  fontFamily: '$body',
  variants: {
    isHeading: {
      true: {
        fontFamily: '$heading',
      },
    },
  } as const,
})

// need to fix the ls shouldnt be necessary on medias
const Subtitle = styled(Paragraph, {
  color: '$gray10',
  size: '$6',
  fontFamily: '$silkscreen',
  ta: 'left',
  ls: 10,

  $sm: {
    ta: 'center',
    size: '$7',
  },
})

// const NumberTicker = () => {
//   const [numbers, setNumbers] = useState([0, 5, 2, 3])

//   useEffect(() => {
//     setTimeout(() => {
//       setNumbers(
//         numbers.map((n) => {
//           return Math.floor(Math.random() * 10)
//         })
//       )
//     }, 3000)
//   }, [numbers])

//   return (
//     <XStack als="center" m="auto">
//       {numbers.map((n, i) => {
//         return (
//           <AnimatePresence exitBeforeEnter key={i}>
//             <H1
//               animation="quick"
//               enterStyle={{
//                 y: -30,
//                 o: 0,
//               }}
//               exitStyle={{
//                 y: 30,
//                 o: 0,
//               }}
//               o={1}
//               key={n}
//             >
//               {n}
//             </H1>
//           </AnimatePresence>
//         )
//       })}
//     </XStack>
//   )
// }

// export const View = styled(YStack, {
//   variants: {
//     center: {
//       true: {
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
//     },
//     absolute: {
//       true: {
//         position: 'absolute',
//       },
//     },
//     stretch: {
//       true: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//       },
//     },
//   } as const,
// })

// const DrawListRow = styled(View, {
//   fd: 'row',
//   columnGap: '$3',
//   ai: 'flex-start',
//   $md: {
//     ai: 'center',
//     columnGap: '$1',
//   },
//   $lg: {
//     columnGap: '$3',
//   },
//   rowGap: '$3',
//   px: '$3',
// })

// const PopoverRenderTest = memo(() => {
//   return (
//     <Popover keepChildrenMounted size="$5" stayInFrame={{ padding: 20 }}>
//       <Popover.Trigger asChild>
//         <Button
//           size="$3"
//           chromeless
//           circular
//           hoverStyle={{
//             bc: 'transparent',
//           }}
//           noTextWrap
//         >
//           <Menu size={16} color="var(--color)" />
//         </Button>
//       </Popover.Trigger>

//       <Adapt platform="touch" when="sm">
//         <Popover.Sheet
//           zIndex={100000000}
//           modal
//           dismissOnSnapToBottom
//           animationConfig={{
//             type: 'spring',
//             damping: 20,
//             mass: 1.2,
//             stiffness: 250,
//           }}
//         >
//           <Popover.Sheet.Frame>
//             <Popover.Sheet.ScrollView>
//               <Adapt.Contents />
//             </Popover.Sheet.ScrollView>
//           </Popover.Sheet.Frame>
//           <Popover.Sheet.Overlay zIndex={100} />
//         </Popover.Sheet>
//       </Adapt>

//       <Popover.Content
//         bw={1}
//         boc="$borderColor"
//         enterStyle={{ x: 0, y: -10, o: 0 }}
//         exitStyle={{ x: 0, y: -10, o: 0 }}
//         x={0}
//         y={0}
//         o={1}
//         animation={[
//           'quick',
//           {
//             opacity: {
//               overshootClamping: true,
//             },
//           },
//         ]}
//         animateOnly={['transform', 'opacity']}
//         p={0}
//         maxHeight="80vh"
//         elevate
//         zIndex={100000000}
//       >
//         <Popover.Arrow borderWidth={1} boc="$borderColor" />

//         <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//           <YStack miw={230} p="$3" ai="flex-end">
//             <Square size={100} bc="red" />
//           </YStack>
//         </Popover.ScrollView>
//       </Popover.Content>
//     </Popover>
//   )
// })

export const LinkButton = withStaticProperties(
  forwardRef(function LinkButton(
    { ...props }: Omit<React.ComponentProps<typeof Button>, 'href' | 'target'>,
    ref: React.Ref<TamaguiElement>
  ) {
    return (
      <Button
        ref={ref}
        {...props}
        {...(props.disabled && Platform.OS === 'web' && { href: undefined })}
        tag="a"
      />
    )
  }),
  {
    Text: Button.Text,
    Icon: Button.Icon,
  }
)
