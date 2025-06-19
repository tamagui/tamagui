import { Configuration, XStack, YStack } from 'tamagui'
import { animationsCSS } from '../config/tamagui/animationsCSS'

export default function Sandbox() {
  return (
    <>
      {/* <Performance /> */}
      <Drivers />
    </>
  )
}

// there's a sort-of bug in that if you are only using CSS driver in an entire tree
// you can avoid re-rendering entirely when doing group stuff, but we don't do that for now
// YStack will re-render on hovers etc because it can't assume children don't have any dynamicity
// we could improve this by having groups provide some context / listen for children mounting that
// are dynamic, and *if not* they don't re-render on hover / set group state at all.
const Drivers = () => {
  return (
    <Configuration animationDriver={animationsCSS}>
      {/* because css here and below, this group YStack can avoid re-rendering */}
      <YStack group="card">
        <XStack debug="verbose" width={100} height={100} bg="red" />
        <XStack debug="verbose" width={100} height={100} bg="red" />
      </YStack>
    </Configuration>
  )
}

// const Performance = () => {
//   const [k, setK] = useState(0)

//   return (
//     <>
//       {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
//       <div style={{ color: 'red' }} onClick={() => setK(Math.random())}>
//         render
//       </div>
//       <TimedRender key={k}>
//         <Circle
//           debug="profile"
//           size={36}
//           borderWidth={2}
//           bg="yellow"
//           borderColor="red"
//           hoverStyle={{
//             borderColor: 'green',
//           }}
//           onPress={() => {
//             //
//           }}
//         />
//       </TimedRender>
//     </>
//   )
// }

// import React from 'react'
// import { animationsCSS } from '../config/tamagui/animationsCSS'

// export function TimedRender(props) {
//   const [start] = React.useState(performance.now())
//   const [end, setEnd] = React.useState(0)

//   React.useLayoutEffect(() => {
//     setEnd(performance.now() - start)
//   }, [start])

//   return (
//     <View style={{ maxWidth: '100%' }}>
//       {!!end && <Text>Took {end}ms</Text>}
//       <View style={{ flexDirection: 'column' }}>{props.children}</View>
//     </View>
//   )
// }
