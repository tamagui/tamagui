import { useState } from 'react'
import { Text, View, XStack, YStack, styled } from 'tamagui'

const GREEN = 'rgb(27, 122, 61)'
const GREY = 'rgb(217, 215, 210)'
const DARKGREEN = 'rgb(15, 80, 38)'

const Btn = styled(View, {
  width: 64,
  height: 64,
  borderRadius: 32,
  borderWidth: 1,
})

/**
 * Repro for the reanimated emitter latch dropping base-style changes when the
 * frame is a `group` and the changed property comes from a pseudo style
 * (disabledStyle). Reported by Wez (June 2026), native reanimated driver.
 *
 * Once a press fires the useStyleEmitter fast path (pressStyle present), the
 * worklet latches onto the last-emitted snapshot. The re-render that flips
 * `disabled` merges disabledStyle into the base style, but before the
 * latch-drop fix the worklet kept painting the stale latched colors and the
 * grey never reached the screen. A child label re-rendering fine proves it's
 * the animated style commit, not React.
 */
export function GroupDisabledStyleLatchCase() {
  const [disabled, setDisabled] = useState(false)

  return (
    <YStack gap="$4" items="center" p="$4">
      <XStack gap="$4">
        {/* minimized shape from the report: no press/hover styles. it never flips
            press state (no pressStyle, no group children) so the latch stays off —
            kept here as a sanity check that plain disabled toggles work */}
        <Btn
          testID="group-disabled-btn"
          group
          transition="quick"
          animateOnly={['backgroundColor', 'borderColor']}
          disabled={disabled}
          backgroundColor={GREEN}
          borderColor={GREEN}
          disabledStyle={{ backgroundColor: GREY, borderColor: GREY }}
          onPress={() => setDisabled((d) => !d)}
        />

        {/* pressStyle variant: the press that toggles disabled latches the emitter itself */}
        <Btn
          testID="group-disabled-press-btn"
          group
          transition="quick"
          animateOnly={['backgroundColor', 'borderColor']}
          disabled={disabled}
          backgroundColor={GREEN}
          borderColor={GREEN}
          pressStyle={{ backgroundColor: DARKGREEN, borderColor: DARKGREEN }}
          disabledStyle={{ backgroundColor: GREY, borderColor: GREY }}
          onPress={() => setDisabled((d) => !d)}
        />
      </XStack>

      <Text testID="group-disabled-state">{disabled ? 'disabled' : 'enabled'}</Text>

      {/* external toggle to re-enable: the disabled circles no longer receive presses */}
      <View
        testID="group-disabled-toggle"
        p="$3"
        bg="$color5"
        onPress={() => setDisabled((d) => !d)}
      >
        <Text>Toggle disabled</Text>
      </View>
    </YStack>
  )
}
