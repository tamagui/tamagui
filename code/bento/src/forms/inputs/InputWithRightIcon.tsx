import type { ComponentSize } from '@tamagui/core'
import { AlarmClock } from '../../icons'
import { useRef } from 'react'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import type { TextInput } from 'react-native'
import { useForwardFocus } from './hooks/useForwardFocus'

/**
 * note: make sure to use the same width for the input and the container
 */

/** ------ EXAMPLE ------ */
export function InputWithRightIconDemo({ size = 'md' }: { size?: ComponentSize }) {
  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)
  return (
    <View justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Box>
          <Input.Area ref={inputRef} pr={0} placeholder="Set alarm" />
          <Input.Icon {...focusTrigger}>
            <AlarmClock />
          </Input.Icon>
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithRightIconDemo.fileName = 'InputWithRightIcon'
