import { styled, Text, Theme, View } from 'tamagui'
import SheetIsland from '../.tamagui/zero/SheetIsland.loader'

// app-local styled definition in a module with another live export: the styled
// scoping probe. `Card` is used only in lowered JSX.
const Card = styled(View, {
  name: 'ZeroCard',
  backgroundColor: '#1d4ed8',
  padding: 16,
  borderRadius: 8,
})

export const appTitle = 'zero-runtime fixture'

export function App() {
  return (
    <View data-testid="zero-root" padding={24} gap={12}>
      <Text data-testid="zero-text" color="#111827" fontSize={20}>
        {appTitle}
      </Text>
      <Card data-testid="zero-card" />
      <Theme name="dark" background="#0b2545">
        <View data-testid="zero-theme-child" padding={8}>
          <SheetIsland data-testid="island-mount" />
        </View>
      </Theme>
    </View>
  )
}
