import type { ComponentSize } from '@tamagui/core'
import { X } from '../../icons'
import type { ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']
/** ------ EXAMPLE ------ */
export function ChipsWithCloseIcon({ size = 'md' }: { size?: ComponentSize }) {
  return (
    <View flexDirection="column" justify="center" items="center" width="100%">
      <View flexDirection="row" flexWrap="wrap" shrink={1} gap="2" p="4">
        {colors.map((color) => (
          <Chip circular size={size} key={color} theme={color as ThemeName}>
            <Chip.Text>Cake</Chip.Text>
            <Chip.Button alignRight>
              <Chip.Icon>
                <X color="red" />
              </Chip.Icon>
            </Chip.Button>
          </Chip>
        ))}
      </View>
    </View>
  )
}
