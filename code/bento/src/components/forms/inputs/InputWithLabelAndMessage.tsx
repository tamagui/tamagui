import { useId } from 'react'
import { Input } from './components/inputsParts'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function InputWithLabelAndMessageDemo({ size }: { size?: SizeTokens }) {
  const uniqueId = useId()

  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" gap="$6">
      <Input size={size} minWidth="100%" $group-window-gtXs={{ minWidth: 150 }}>
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
