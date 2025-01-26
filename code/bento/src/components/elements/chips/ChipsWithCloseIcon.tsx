import { X } from '@tamagui/lucide-icons'
import type { SizeTokens, ThemeName } from 'tamagui'
import { View } from 'tamagui'
import { Chip } from './components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

/** ------ EXAMPLE ------ */
export function ChipsWithCloseIcon({ size }: { size?: SizeTokens }) {
  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" width="100%">
      <View flexDirection="row" flexWrap="wrap" flexShrink={1} gap="$2" padding="$4">
        {colors.map((color) => (
          <Chip rounded size={size} key={color} theme={color as ThemeName}>
            <Chip.Text>Cake</Chip.Text>
            <Chip.Button alignRight>
              <Chip.Icon>
                <X color="$color9" />
              </Chip.Icon>
            </Chip.Button>
          </Chip>
        ))}
      </View>
    </View>
  )
}

ChipsWithCloseIcon.fileName = 'ChipsWithCloseIcon'
