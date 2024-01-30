// debug-verbose
// import './wdyr'

import { useState } from 'react'
import { View } from 'react-native'

export const Sandbox = () => {
  const [open, setOpen] = useState(true)

  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        {/* <AnimatedNumbers /> */}
        {/* <Square debug="verbose" size={100} bg="$tokenNonExistent" /> */}
      </>
    </View>
  )
}

// const AnimatedNumbers = () => {
//   const [numbers, setNumbers] = useState(10_000)

//   return (
//     <>
//       <Button onPress={() => setNumbers(Math.round(Math.random() * 10_000))}>Next</Button>

//       <Stack importantForAccessibility="auto" />

//       <AnimatePresence enterVariant="fromTop" exitVariant="toBottom">
//         {`${numbers}`.split('').map((num, i) => {
//           return <AnimatedNumber key={`${num}${i}`}>{num}2</AnimatedNumber>
//         })}
//       </AnimatePresence>
//     </>
//   )
// }

// const AnimatedNumber = styled(Text, {
//   fontSize: 20,
//   color: '$color',

//   variants: {
//     fromTop: {
//       true: {
//         y: -10,
//         o: 0,
//       },
//     },

//     toBottom: {
//       true: {
//         y: 10,
//         o: 0,
//       },
//     },
//   } as const,
// })
