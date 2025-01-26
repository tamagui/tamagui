import { AlertCircle } from '@tamagui/lucide-icons'
import React, { useId, useRef } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import type { TextInput } from 'react-native'
import { useForwardFocus } from './hooks/useForwardFocus'

/**
 * note: make sure to use the same width for the Input and the Input.Area
 */

/** ------ EXAMPLE ------ */
export function InputWithErrorDemo({ size }: { size?: SizeTokens }) {
  const uniqueId = useId()
  const [error, setError] = React.useState(true)

  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)

  return (
    <View flexDirection="column" justifyContent="center" alignItems="center">
      <Input
        {...(error && {
          theme: 'red',
        })}
        size={size}
        minWidth="100%"
      >
        <Input.Label htmlFor={uniqueId + 'email'}>Label</Input.Label>
        <Input.Box>
          {error && (
            <Input.Icon {...focusTrigger}>
              <AlertCircle />
            </Input.Icon>
          )}
          <Input.Area
            ref={inputRef}
            paddingLeft={0}
            id={uniqueId + 'email'}
            placeholder="example@something"
          />
        </Input.Box>
        <Input.Info>Your email is invalid.</Input.Info>
      </Input>
    </View>
  )
}

InputWithErrorDemo.fileName = 'InputWithError'
