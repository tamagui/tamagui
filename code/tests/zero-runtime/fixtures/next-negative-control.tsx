import { Text, View } from 'tamagui'
import { countSpaceTokens } from '../src/opaqueDesignState'

void countSpaceTokens()

export default function NegativeControlPage() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">opaque design state</Text>
    </View>
  )
}
