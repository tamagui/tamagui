import { AlarmClock } from '@tamagui/lucide-icons'
import { useRef } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import type { TextInput } from 'react-native'
import { useForwardFocus } from './hooks/useForwardFocus'

/**
 * note: make sure to use the same width for the input and the container
 */

/** ------ EXAMPLE ------ */
export function InputWithRightIconDemo({ size }: { size?: SizeTokens }) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)
  return (
    <View justifyContent="center" alignItems="center">
      <Input size={size} minWidth="100%">
        <Input.Box>
          <Input.Area ref={inputRef} paddingRight={0} placeholder="Set alarm" />
          <Input.Icon {...focusTrigger}>
            <AlarmClock />
          </Input.Icon>
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithRightIconDemo.fileName = 'InputWithRightIcon'
