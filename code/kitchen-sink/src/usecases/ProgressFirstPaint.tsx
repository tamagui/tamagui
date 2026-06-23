import { useEffect, useState } from 'react'
import { Button, Progress, YStack } from 'tamagui'

// regression case for #4011: the indicator must paint at its correct position on
// the very first frame and never flash to full (100%) before settling. it also
// forces a re-render shortly after mount to mimic the animated driver's
// post-hydrate activation render (where the flash used to appear on the docs
// site), and exposes a button so we can verify value changes still animate.
export function ProgressFirstPaint() {
  const [value, setValue] = useState(60)
  const [, force] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => force(1), 300)
    return () => clearTimeout(id)
  }, [])

  return (
    <YStack gap="$4" padding="$4" width={300}>
      <Progress testID="progress" theme="surface2" value={value}>
        <Progress.Indicator
          testID="progress-indicator"
          backgroundColor="$color"
          transition={[
            'quicker',
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Progress>

      <Button testID="progress-set-90" onPress={() => setValue(90)}>
        set 90
      </Button>
    </YStack>
  )
}
