import { Cake } from '@tamagui/lucide-icons'
import type { SizeTokens, ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']
function ChipsItem({ color, size }: { color: string; size: SizeTokens }) {
  return (
    <Chip backgroundColor="$color4" rounded theme={color as ThemeName} size={size}>
      <Chip.Icon y={-1} scaleIcon={1.1} color="$color9">
        <Cake />
      </Chip.Icon>
      <Chip.Text color="$color9">Cake</Chip.Text>
    </Chip>
  )
}

/** ------ EXAMPLE ------ */
export function ChipsWithIcon({ size }: { size?: SizeTokens }) {
  return (
    <View flexDirection="row" flexShrink={1} flexWrap="wrap" gap="$2" padding="$4">
      {colors.map((color) => (
        <ChipsItem size={size ?? '$4'} key={color} color={color} />
      ))}
    </View>
  )
}

ChipsWithIcon.fileName = 'ChipsWithIcon'
