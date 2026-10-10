import type { ComponentSize } from '@tamagui/core'
import { AlertCircle } from '../../icons'
import React, { useId, useRef } from 'react'
import type { TextInputInstance as TextInput } from 'react-native'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'
import { useForwardFocus } from './hooks/useForwardFocus'

/**
 * note: make sure to use the same width for the Input and the Input.Area
 */

/** ------ EXAMPLE ------ */
export function InputWithErrorDemo({ size = 'md' }: { size?: ComponentSize }) {
  const uniqueId = useId()
  const [error, setError] = React.useState(true)

  const inputRef = useRef<TextInput>(null)
  const focusTrigger = useForwardFocus(inputRef)

  return (
    <View flexDirection="column" justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Label htmlFor={uniqueId + 'email'}>Email</Input.Label>
        <Input.Box {...(error && { borderColor: 'red-9' })}>
          {error && (
            <Input.Icon color="red-10" {...focusTrigger}>
              <AlertCircle />
            </Input.Icon>
          )}
          <Input.Area
            ref={inputRef}
            pl={error ? 0 : undefined}
            id={uniqueId + 'email'}
            aria-invalid={error}
            defaultValue="ada@lovelace"
            onChangeText={(text) => setError(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text))}
          />
        </Input.Box>
        <Input.Info {...(error && { color: 'red-10' })}>
          {error ? 'Enter an email like name@example.com.' : 'We never share your email.'}
        </Input.Info>
      </Input>
    </View>
  )
}
