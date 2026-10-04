import { useId } from 'react'
import { Input } from './components/inputsParts'
import type { FontSizeTokens } from 'tamagui'
import { View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function InputWithLabelAndMessageDemo({
  size = '4',
}: {
  size?: FontSizeTokens
}) {
  const uniqueId = useId()

  return (
    <View flexDirection="column" justify="center" items="center" gap="6">
      <Input size={size} minW="100% @gtXs/window:150px">
        <Input.Label htmlFor={uniqueId + 'email'}>Email Address</Input.Label>
        <Input.Box>
          <Input.Area
            autoComplete="email"
            id={uniqueId + 'email'}
            placeholder="email@example.com"
          />
        </Input.Box>
        <Input.Info>We never share your email with anyone else.</Input.Info>
      </Input>
    </View>
  )
}

InputWithLabelAndMessageDemo.fileName = 'InputWithLabelAndMessage'
