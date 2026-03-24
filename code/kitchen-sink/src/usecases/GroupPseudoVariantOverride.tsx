import { View, styled } from 'tamagui'

// reproduces bug where variant's $group-<name>-press opacity
// doesn't override the base $group-<name>-press opacity

const Overlay = styled(View, {
  position: 'absolute',
  pointerEvents: 'none',
  inset: 0,
  backgroundColor: 'blue',
  opacity: 1,

  '$group-testy-hover': {
    opacity: 0.4,
  },

  '$group-testy-press': {
    opacity: 0.6,
  },

  variants: {
    variant: {
      action: {
        backgroundColor: 'green',

        '$group-testy-hover': {
          opacity: 1,
          backgroundColor: 'yellow',
        },

        '$group-testy-press': {
          opacity: 1,
          backgroundColor: 'red',
        },
      },
    },
  } as const,
})

export function GroupPseudoVariantOverride() {
  return (
    <View gap="$4" padding="$4">
      {/* base: press should get opacity 0.6 */}
      <View group="testy" id="base-group" padding="$4" backgroundColor="$gray5">
        <Overlay id="base-overlay" />
        <View height={40} />
      </View>

      {/* action variant: press should get opacity 1 (overriding base 0.6) */}
      <View group="testy" id="action-group" padding="$4" backgroundColor="$gray5">
        <Overlay id="action-overlay" variant="action" />
        <View height={40} />
      </View>
    </View>
  )
}
