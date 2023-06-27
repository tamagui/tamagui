import { AccordionDemo } from '@tamagui/demos'
import { Moon } from '@tamagui/lucide-icons'
import { H1, Stack, getConfig, getToken, getTokenValue, getTokens } from 'tamagui'

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
  return <AccordionDemo />
}
