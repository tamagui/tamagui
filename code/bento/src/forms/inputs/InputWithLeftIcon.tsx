import { Antenna } from '../../icons'
import { useRef } from 'react'
import type { FontSizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import { useForwardFocus } from './hooks/useForwardFocus'
import type { TextInput } from 'react-native'

/** ------ EXAMPLE ------ */
export function InputWithLeftIconDemo({ size = '4' }: { size?: FontSizeTokens }) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)
  return (
    <View flexDirection="column" justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Box>
          <Input.Icon {...focusTrigger}>
            <Antenna />
          </Input.Icon>
          <Input.Area ref={inputRef} pl={0} placeholder="Set antenna number" />
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithLeftIconDemo.fileName = 'InputWithLeftIcon'
