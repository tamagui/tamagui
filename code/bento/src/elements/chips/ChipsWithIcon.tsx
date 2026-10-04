import type { ComponentSize } from '@tamagui/core'
import { Cake } from '../../icons'
import type { ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

function ChipsItem({ color, size = 'md' }: { color: string; size: ComponentSize }) {
  return (
    <Chip bg="color-4" circular theme={color as ThemeName} size={size}>
      <Chip.Icon y={-1} color="color-8" scaleIcon={1.1}>
        <Cake />
      </Chip.Icon>
      <Chip.Text color="color-8">Cake</Chip.Text>
    </Chip>
  )
}

/** ------ EXAMPLE ------ */
export function ChipsWithIcon({ size = 'md' }: { size?: ComponentSize }) {
  return (
    <View flexDirection="row" shrink={1} flexWrap="wrap" gap="2" p="4">
      {colors.map((color) => (
        <ChipsItem size={size ?? 'md'} key={color} color={color} />
      ))}
    </View>
  )
}
