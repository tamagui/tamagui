import { getTokens } from '@tamagui/core'
import { createRoot } from 'react-dom/client'
import { Text, View } from 'tamagui'

/**
 * The compiler-local gate's independent variable.
 *
 * A statically imported design-state read that lowering cannot consume. Erasure
 * must refuse to remove it and report the site, rather than deleting the import
 * and leaving a runtime ReferenceError.
 */
function LiveReference() {
  return (
    <View data-testid="zero-root" padding={24}>
      <Text data-testid="zero-text">
        space tokens: {Object.keys(getTokens().space).length}
      </Text>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<LiveReference />)
