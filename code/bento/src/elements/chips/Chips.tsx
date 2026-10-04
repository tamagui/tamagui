import type { SizeTokens, ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

/** ------ EXAMPLE ------ */
export function Chips({ size = '4' }: { size?: SizeTokens }) {
  return (
    <View flexDirection="column" justify="center" items="center" width="100%">
      <View flexDirection="row" flexWrap="wrap" shrink={1} gap="2" p="4">
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
