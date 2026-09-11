import { getTokens } from '@tamagui/core'
import { Text, View } from 'tamagui'

/**
 * The compiler-local gate's independent variable: a statically imported design
 * state read that lowering cannot consume.
 */
export default function LiveReferencePage() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">
        space tokens: {Object.keys(getTokens().space).length}
      </Text>
    </View>
  )
}
