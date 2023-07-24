// debug
// import './wdyr'

import { Button, Circle, H2, Paragraph, SizableText, Text, XStack, styled } from 'tamagui'

export const Sandbox = () => {
  return (
    <>
      {/* <Subtitle debug="verbose">hello</Subtitle> */}

      {/* <Paragraph size="$15" pos="absolute" rotate="-10deg" ta="center" ff="$silkscreen">
        WATCH THE VIDEO
      </Paragraph> */}

      <Button.Text fontWeight="900">test out</Button.Text>

      <H2
        className="clip-text mix-blend"
        ff="$mono"
        size="$12"
        lh="$11"
        color="$color10"
        mb="$4"
        style={{
          // @ts-ignore
          backgroundImage: `-webkit-linear-gradient(100deg, var(--color9), yellow)`,
        }}
        $gtLg={{
          mr: 100,
        }}
        $lg={{
          size: '$9',
          lh: '$8',
        }}
        $sm={{
          size: '$8',
          lh: '$7',
        }}
      >
        test
      </H2>

      {/* <ChangeFamilyVariant debug="verbose" size="$15">
        Test
      </ChangeFamilyVariant>
      <ChangeFamilyVariant size="$15" isHeading>
        Test
      </ChangeFamilyVariant> */}
    </>
  )
}

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
