import { controlSizes } from '@tamagui/size'
import { Button, Input, Square, XStack, YStack, Paragraph } from 'tamagui'

/**
 * Every control ramp step, rendered so a test can measure whether the frame
 * actually fits its own text. That is the check whose absence let `size="3"`
 * ship as a 12px-tall Button holding 16px text.
 *
 * Sub-1 steps are excluded on purpose: v2's own size scale describes them as
 * fine-grained values for borders and the smallest padding, not control
 * presets, and a 2px control cannot hold text by construction.
 */
export const CONTROL_RAMP_STEPS = Object.keys(controlSizes).filter(
  (key) => key !== 'true' && Number.parseFloat(key.replace('-', '.')) >= 1
)

export function ControlSizeRampCase() {
  return (
    <YStack padding="4" gap="4">
      <Paragraph testID="ramp-step-count">{CONTROL_RAMP_STEPS.length}</Paragraph>

      {/* default, unsized: must equal the ramp's `true` step */}
      <XStack gap="3" items="center">
        <Button testID="ramp-button-default">Default</Button>
        <Input testID="ramp-input-default" defaultValue="Default" />
      </XStack>

      {CONTROL_RAMP_STEPS.map((step) => (
        <XStack key={step} gap="3" items="center">
          <Button testID={`ramp-button-${step}`} size={step as any}>
            Size {step}
          </Button>
          <Input
            testID={`ramp-input-${step}`}
            size={step as any}
            defaultValue={`Size ${step}`}
          />
        </XStack>
      ))}

      {/* geometry must NOT move onto the control ramp: these stay on the
          config's spacing scale, where 5 is 20px */}
      <XStack gap="3">
        <Square testID="ramp-square-5" size="5" backgroundColor="blue-500" />
        <Square testID="ramp-square-3" size="3" backgroundColor="blue-500" />
      </XStack>
    </YStack>
  )
}
