import type { ComponentSize } from '@tamagui/core'
import type { ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

/** ------ EXAMPLE ------ */
export function ChipsNoTextColor({ size = 'md' }: { size?: ComponentSize }) {
  return (
    <View flexDirection="column" justify="center" items="center" width="100%">
      <View flexDirection="row" flexWrap="wrap" shrink={1} gap="2" p="4">
        {colors.map((color) => (
          <Chip
            pressable
            role="button"
            tabIndex={0}
            onPress={() => {
              setTimeout(() => {
                alert('pressed')
              })
            }}
            theme={color as ThemeName}
            size={size}
            key={color}
          >
            <Chip.Text color="#fff">Input</Chip.Text>
          </Chip>
        ))}
      </View>
    </View>
  )
}

ChipsNoTextColor.fileName = 'ChipsNoTextColor'
