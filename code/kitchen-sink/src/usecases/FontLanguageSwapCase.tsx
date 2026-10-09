import { useState } from 'react'
import { Button, FontLanguage, Text, YStack } from 'tamagui'

/**
 * Swapping a font face by language.
 *
 * A font key of `body_ja` in the config emits its own rule set behind
 * `.t_lang-body-ja`, and `<FontLanguage body="ja">` puts that class on a
 * wrapper. The part worth testing is that the swap carries the FACE'S OWN
 * METRICS with it — `3` has to mean the ja size and the ja line height inside
 * the wrapper, not the default face's numbers with a different family name
 * painted on. Those come through CSS variables, so only a real browser
 * resolving the cascade can answer it.
 */
export function FontLanguageSwapCase() {
  const [japanese, setJapanese] = useState(false)

  return (
    <YStack gap="4" p="4">
      <Text data-testid="default-face" fontFamily="body" fontSize="3" lineHeight="3">
        default face
      </Text>

      <FontLanguage body="ja">
        <Text data-testid="ja-face" fontFamily="body" fontSize="3" lineHeight="3">
          ja face
        </Text>
      </FontLanguage>

      {/* the same element, swapped at runtime rather than two static trees */}
      <Button data-testid="toggle-language" onPress={() => setJapanese((on) => !on)}>
        toggle
      </Button>
      {japanese ? (
        <FontLanguage body="ja">
          <Text data-testid="swapped-face" fontFamily="body" fontSize="3" lineHeight="3">
            swapped
          </Text>
        </FontLanguage>
      ) : (
        <Text data-testid="swapped-face" fontFamily="body" fontSize="3" lineHeight="3">
          swapped
        </Text>
      )}
    </YStack>
  )
}
