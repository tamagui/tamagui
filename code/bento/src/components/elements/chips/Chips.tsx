import type { SizeTokens, ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

/** ------ EXAMPLE ------ */
export function Chips({ size }: { size?: SizeTokens }) {
  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" width="100%">
      <View flexDirection="row" flexWrap="wrap" flexShrink={1} gap="$2" padding="$4">
        {colors.map((color) => (
          <Chip theme={color as ThemeName} size={size} key={color}>
            <Chip.Text>Input</Chip.Text>
          </Chip>
        ))}
      </View>
    </View>
  )
}

Chips.fileName = 'Chips'
