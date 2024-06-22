import { useEffect, useState } from 'react'
import { AnimatePresence, Button, Circle, H1, YStack } from 'tamagui'

global.shouldDebugMoti = true

function TestEnter() {
  const [key, setKey] = useState(0)

  return (
    <>
      <Circle
        key={key}
        debug="verbose"
        size={100}
        bg="red"
        animation="superLazy"
        hoverStyle={{
          scale: 2,
        }}
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      />

      <Button
        onPress={() => {
          console.warn('press!')
          setKey(Math.random())
        }}
      >
        remount
      </Button>
    </>
  )
}

export default function TestPage() {
  console.log('render')

  useEffect(() => {
    console.warn('hi mom')
  }, [])

  return (
    <>
      <TestEnter />

      {/* <H1
        ta="left"
        size="$14"
        maw={500}
        pos="relative"
        debug="verbose"
        // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
        // $gtSm={{
        //   mx: 0,
        //   maxWidth: 800,
        //   size: '$14',
        //   h: 250,
        //   ta: 'center',
        //   als: 'center',
        // }}
        // $gtMd={{
        //   maxWidth: 900,
        //   size: '$15',
        //   h: 310,
        // }}
        // $gtLg={{
        //   size: '$16',
        //   lh: 146,
        //   maxWidth: 1200,
        //   h: 310,
        // }}
        animation="superLazy"
        enterStyle={{
          // opacity: 0,
          y: -100,
        }}
      >
        write less
      </H1> */}
    </>
  )

  // return (
  //   <>
  //     <YStack
  //       pos="absolute"
  //       t={0}
  //       l={0}
  //       pe="none"
  //       animation="kindaBouncy"
  //       key={0}
  //       zi={0}
  //       x={0}
  //       o={0.4}
  //     >
  //       <AnimatePresence>
  //         <YStack
  //           animation="superLazy"
  //           debug="verbose"
  //           enterStyle={{
  //             opacity: 0,
  //           }}
  //           exitStyle={{
  //             opacity: 0,
  //           }}
  //           overflow="hidden"
  //           h="100vh"
  //           mah={1000}
  //           w={1000}
  //           pos="absolute"
  //           t={0}
  //           l={0}
  //           y={100}
  //           scale={0.5}
  //           bg="red"
  //         />
  //       </AnimatePresence>
  //     </YStack>
  //   </>
  // )
}

// function TestTooltip() {
//   useEffect(() => {
//     console.warn('hi mom')
//   }, [])

//   return (
//     <Tooltip>
//       <Tooltip.Trigger>
//         <Button size={100} als="center" circular />
//       </Tooltip.Trigger>
//       <Tooltip.Content
//         debug="verbose"
//         enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
//         exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
//         scale={1}
//         x={0}
//         y={0}
//         opacity={1}
//         animation={[
//           'quick',
//           {
//             opacity: {
//               overshootClamping: true,
//             },
//           },
//         ]}
//       >
//         <Tooltip.Arrow />
//         <Paragraph size="$2" lineHeight="$1">
//           Hello world
//         </Paragraph>
//       </Tooltip.Content>
//     </Tooltip>
//   )
// }
