import { Antenna } from '@tamagui/lucide-icons'
import { useRef } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import { useForwardFocus } from './hooks/useForwardFocus'
import type { TextInput } from 'react-native'

/** ------ EXAMPLE ------ */
export function InputWithLeftIconDemo({ size }: { size?: SizeTokens }) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)
  return (
    <View flexDirection="column" justifyContent="center" alignItems="center">
      <Input size={size} minWidth="100%">
        <Input.Box>
          <Input.Icon {...focusTrigger}>
            <Antenna />
          </Input.Icon>
          <Input.Area ref={inputRef} paddingLeft={0} placeholder="Set antena number" />
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithLeftIconDemo.fileName = 'InputWithLeftIcon'
