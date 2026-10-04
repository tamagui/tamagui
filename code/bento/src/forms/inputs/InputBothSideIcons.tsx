import { User, Cable } from '../../icons'
import { useRef } from 'react'
import type { FontSizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import { useForwardFocus } from './hooks/useForwardFocus'
import type { TextInput } from 'react-native'

/**
 * note: make sure to use the same width for the input and the container
 */

/** ------ EXAMPLE ------ */
export function InputBothSideIconsExample({
  size = '4',
}: {
  size?: FontSizeTokens
}) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)

  return (
    <View justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Box>
          <Input.Icon {...focusTrigger}>
            <User />
          </Input.Icon>
          <Input.Area ref={inputRef} px={0} placeholder="Search username" />
          <Input.Icon {...focusTrigger}>
            <Cable />
          </Input.Icon>
        </Input.Box>
      </Input>
    </View>
  )
}

InputBothSideIconsExample.fileName = 'InputBothSideIcons'
