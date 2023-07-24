// debug-verbose
// import './wdyr'

import { Button, Circle, SizableText, Text, XStack, styled } from 'tamagui'

export const Sandbox = () => {
  return (
    <>
      <Circle width={100} height={100} bc={'red'} />
      <CustomText>hello</CustomText>
    </>
  )
}

export const CustomText = styled(SizableText, {
  fontFamily: '$body',

  variants: {
    bold: {
      true: {
        fontFamily: '$heading',
      },
    },
  } as const,

  defaultVariants: {
    bold: false,
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
