import type { FontSizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Input } from './components/inputsParts'

/** ------ EXAMPLE ------ */
export function InputWithLabelDemo({
  labelText = 'Label',
  size = '4',
  focusOnMount = false,
  onChangeText,
}: {
  size?: FontSizeTokens
  focusOnMount?: boolean
  labelText?: string
  onChangeText?: (text: string) => void
}) {
  return (
    <View flexDirection="column" justify="center" items="center">
      <Input size={size} minW="100%">
        <Input.Label htmlFor="input" mb="1">
          {labelText}
        </Input.Label>
        <Input.Box>
          <Input.Area
            id="input"
            placeholder="email@example.com"
            autoFocus={focusOnMount}
            onChangeText={onChangeText}
          />
        </Input.Box>
      </Input>
    </View>
  )
}

InputWithLabelDemo.fileName = 'InputWithLabel'
