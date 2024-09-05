import { Button, Circle, H2, styled } from 'tamagui'

global.shouldDebugMoti = true

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
  name: 'HomeH2',
  ta: 'center',
  als: 'center',
  size: '$10',
  maw: 720,
  mt: '$-2',
  $sm: {
    size: '$10',
  },
  $xs: {
    size: '$9',
  },
})

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import type { TooltipProps } from 'tamagui'
import { Paragraph, Tooltip, TooltipGroup, XStack, YStack } from 'tamagui'

export function TooltipDemo() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack gap="$2" alignSelf="center">
        <XStack gap="$2">
          <Demo groupId="0" placement="top-end" Icon={Circle} />
          <Demo groupId="1" placement="top" Icon={ChevronUp} />
          <Demo groupId="2" placement="top-start" Icon={Circle} />
        </XStack>
        <XStack gap="$2">
          <Demo groupId="3" placement="left" Icon={ChevronLeft} />
          <YStack flex={1} />
          <Demo groupId="4" placement="right" Icon={ChevronRight} />
        </XStack>
        <XStack gap="$2">
          <Demo groupId="5" placement="bottom-end" Icon={Circle} />
          <Demo groupId="6" placement="bottom" Icon={ChevronDown} />
          <Demo groupId="7" placement="bottom-start" Icon={Circle} />
        </XStack>
      </YStack>
    </TooltipGroup>
  )
}

function Demo({ Icon, ...props }: TooltipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
      </Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Tooltip.Arrow />
        <Paragraph size="$2" lineHeight="$1">
          Hello world
        </Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export default function TestPage() {
  return <TooltipDemo />

  // return <Header />

  // useEffect(() => {
  //   console.warn('hi mom')
  // }, [])

  // return (
  //   <>
  //     <TestEnter />

  //     {/* <H1
  //       ta="left"
  //       size="$14"
  //       maw={500}
  //       pos="relative"
  //       debug="verbose"
  //       // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
  //       // $gtSm={{
  //       //   mx: 0,
  //       //   maxWidth: 800,
  //       //   size: '$14',
  //       //   h: 250,
  //       //   ta: 'center',
  //       //   als: 'center',
  //       // }}
  //       // $gtMd={{
  //       //   maxWidth: 900,
  //       //   size: '$15',
  //       //   h: 310,
  //       // }}
  //       // $gtLg={{
  //       //   size: '$16',
  //       //   lh: 146,
  //       //   maxWidth: 1200,
  //       //   h: 310,
  //       // }}
  //       animation="superLazy"
  //       enterStyle={{
  //         // opacity: 0,
  //         y: -100,
  //       }}
  //     >
  //       write less
  //     </H1> */}
  //   </>
  // )

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

// function TestEnter() {
//   const [key, setKey] = useState(0)

//   return (
//     <>

//       <Circle
//         key={key}
//         debug="verbose"
//         size={100}
//         bg="red"
//         animation="bouncy"
//         hoverStyle={{
//           scale: 2,
//         }}
//         enterStyle={{
//           // opacity: 0,
//           y: -100,
//         }}
//       />

//       <Button
//         onPress={() => {
//           console.warn('press!')
//           setKey(Math.random())
//         }}
//       >
//         remount
//       </Button>
//     </>
//   )
// }
