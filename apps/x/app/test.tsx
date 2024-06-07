import { useEffect } from 'react'
import { AnimatePresence, YStack } from 'tamagui'

export default function TestPage() {
  useEffect(() => {
    console.warn('hi mom')
  }, [])

  return (
    <>
      <YStack
        pos="absolute"
        t={0}
        l={0}
        pe="none"
        animation="kindaBouncy"
        key={0}
        zi={0}
        x={0}
        o={0.4}
      >
        <AnimatePresence>
          <YStack
            animation="superLazy"
            debug="verbose"
            enterStyle={{
              opacity: 0,
            }}
            exitStyle={{
              opacity: 0,
            }}
            overflow="hidden"
            h="100vh"
            mah={1000}
            w={1000}
            pos="absolute"
            t={0}
            l={0}
            y={100}
            scale={0.5}
            bg="red"
          />
        </AnimatePresence>
      </YStack>
    </>
  )
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
