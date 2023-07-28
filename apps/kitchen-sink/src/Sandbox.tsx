// debug
// import './wdyr'

import { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Button,
  Paragraph,
  SizableText,
  Stack,
  Text,
  XStack,
  YStack,
  styled,
} from 'tamagui'

const StyledStack = styled(Stack, {
  borderColor: 'red',
  borderWidth: 2,
  padding: 5,
})

const Benchmark = () => {
  return (
    <>
      <BenchmarkOne name="tama" />
      <BenchmarkOne name="rn" />
    </>
  )
}

const BenchmarkOne = ({ name }) => {
  const [x, setX] = useState(0)

  return (
    <>
      <Button onPress={() => setX(Math.random())}>Go</Button>
      <YStack ov="hidden">
        {name === 'rn' && (
          <XStack>
            <BenchRN key={x} />
          </XStack>
        )}
        {name === 'tama' && (
          <XStack>
            <BenchTama key={x} />
          </XStack>
        )}
      </YStack>
    </>
  )
}

const BenchTama = () => {
  return (
    <TimedRender>
      {new Array(1000).fill(0).map((_, i) => (
        <StyledStack key={i} />
      ))}
    </TimedRender>
  )
}

const styles = StyleSheet.create({
  style: {
    borderColor: 'red',
    borderWidth: 2,
    padding: 5,
  },
})

const BenchRN = () => {
  return (
    <TimedRender>
      {new Array(1000).fill(0).map((_, i) => (
        <View style={styles.style} key={i} />
      ))}
    </TimedRender>
  )
}

function TimedRender(props) {
  const [start] = useState(Date.now())
  const [end, setEnd] = useState(0)

  useLayoutEffect(() => {
    setEnd(Date.now())
  }, [])

  return (
    <>
      {!!end && <Text>Took {start - end}ms</Text>}
      {props.children}
    </>
  )
}

export const Sandbox = () => {
  // need to test all these they seem to be all working:
  return (
    <>
      <Benchmark />
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
