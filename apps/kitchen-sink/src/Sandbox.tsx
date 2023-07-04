// debug
import { H1, Square, YStack } from 'tamagui'

// TODO this is a great test: media + animation + space (test without animation too)
// <Stack
//       animation="bouncy"
//       space="$4"
//       debug="verbose"
//       backgroundColor="blue"
//       $sm={{
//         backgroundColor: 'yellow',
//       }}
//       $md={{
//         space: '$5',
//         backgroundColor: 'red',
//       }}
//     >
//       <Square size={20} bc="red" />
//       <Square size={20} bc="red" />
//       <Square size={20} bc="red" />
//     </Stack>

export const Sandbox = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <YStack key={i}>
          <Square size={100} bc="red" />
        </YStack>
      ))}
    </>
  )
  return <H1>test things here</H1>
}
