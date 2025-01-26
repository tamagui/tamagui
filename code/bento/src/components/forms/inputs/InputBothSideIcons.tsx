import { User, Cable } from '@tamagui/lucide-icons'
import { useRef } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import { useForwardFocus } from './hooks/useForwardFocus'
import type { TextInput } from 'react-native'

/**
 * note: make sure to use the same width for the input and the container
 */

/** ------ EXAMPLE ------ */
export function InputBothSideIconsExample({ size }: { size?: SizeTokens }) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)

  return (
    <View justifyContent="center" alignItems="center">
      <Input gapScale={0.7} size={size} minWidth="100%">
        <Input.Box>
          <Input.Icon {...focusTrigger}>
            <User />
          </Input.Icon>
          <Input.Area
            ref={inputRef}
            paddingHorizontal={0}
            placeholder="Search username"
          />
          <Input.Icon {...focusTrigger}>
            <Cable />
          </Input.Icon>
        </Input.Box>
      </Input>
    </View>
  )
}

InputBothSideIconsExample.fileName = 'InputBothSideIcons'
