// import './wdyr'

import {
  H1,
  Paragraph,
  SizableText,
  Text,
  XStack,
  YStack,
  styled,
  useMedia,
} from 'tamagui'

export const Sandbox = () => {
  // need to test all these they seem to be all working:

  console.log(useMedia().gtSm, useMedia().sm)
  return (
    <>
      <XStack justifyContent="center" alignItems="center" flexDirection="column">
        <Paragraph $sm={{ paddingHorizontal: 6 }}>
          useMedia().gtSm: {useMedia().gtSm ? 'TRUE' : 'FALSE'}. if it works the rectangle
          will be red:
        </Paragraph>
        <YStack
          bc="blue"
          $sm={{ backgroundColor: 'yellow' }}
          $gtSm={{ backgroundColor: 'red' }}
          width={100}
          height={100}
        />
      </XStack>
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
        runs faster
      </H1> */}

      {/* <Subtitle debug="verbose">hello</Subtitle> */}
      {/* <Paragraph size="$15" pos="relative" rotate="-10deg" ta="center" ff="$silkscreen">
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

export const View = styled(YStack, {
  variants: {
    center: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    absolute: {
      true: {
        position: 'absolute',
      },
    },
    stretch: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
  } as const,
})

const DrawListRow = styled(View, {
  fd: 'row',
  columnGap: '$3',
  ai: 'flex-start',
  $md: {
    ai: 'center',
    columnGap: '$1',
  },
  $lg: {
    columnGap: '$3',
  },
  rowGap: '$3',
  px: '$3',
})
