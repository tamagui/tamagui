// import './wdyr'

import { useEffect, useState } from 'react'
import { AnimatePresence, H1, Square, XStack, YStack } from 'tamagui'

export const Sandbox = () => {
  const [x, setx] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          setx((x) => !x)
        }}
      >
        sadsadsa
      </button>

      <AnimatePresence>
        {x && (
          <Square
            animation="lazy"
            size={200}
            bc="red"
            enterStyle={{ o: 0.5 }}
            o={1}
            exitStyle={{ o: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

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
