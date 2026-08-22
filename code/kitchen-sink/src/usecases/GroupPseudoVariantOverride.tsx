import { View, styled } from 'tamagui'

// reproduces bug where variant's group-<name>-press opacity
// doesn't override the base group-<name>-press opacity

const Overlay = styled(View, {
  position: 'absolute',
  pointerEvents: 'none',
  inset: 0,
  backgroundColor: 'blue',
  opacity: '1 group-hover/testy:0.4 group-press/testy:0.6',
  variants: {
    variant: {
      action: {
        backgroundColor: 'green group-hover/testy:yellow group-press/testy:red',
        opacity: 'group-hover/testy:1 group-press/testy:1',
      },
    },
  } as const,
})

export function GroupPseudoVariantOverride() {
  return (
    <View gap="4" padding="4">
      {/* base: press should get opacity 0.6 */}
      <View group="testy" padding="4" backgroundColor="gray5" id="base-group">
        <Overlay id="base-overlay" />
        <View height={40} />
      </View>

      {/* action variant: press should get opacity 1 (overriding base 0.6) */}
      <View group="testy" padding="4" backgroundColor="gray5" id="action-group">
        <Overlay id="action-overlay" variant="action" />
        <View height={40} />
      </View>
    </View>
  )
}
