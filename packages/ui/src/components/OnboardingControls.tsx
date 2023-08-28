import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Button, XStack } from 'tamagui'

export type OnboardingControlsProps = {
  currentIdx: number
  onChange: (newIdx: number) => void
  stepsCount: number
  /**
   * native only
   */
  onFinish?: () => void
}

export const OnboardingControls = ({
  currentIdx,
  onChange,
  stepsCount,
}: OnboardingControlsProps) => {
  const handleGoNext = () => {
    if (currentIdx + 1 > stepsCount - 1) {
      // onChange(0)
      return
    }
    onChange(currentIdx + 1)
  }

  const handleGoPrev = () => {
    if (currentIdx - 1 < 0) {
      // onChange(stepsCount - 1)
      return
    }
    onChange(currentIdx - 1)
  }

  return (
    <>
      <XStack
        jc="space-between"
        ai="center"
        p="$5"
        gap="$5"
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        $sm={{ display: 'none' }}
      >
        <Button
          chromeless
          f={1}
          borderRadius="$10"
          circular
          onPress={() => handleGoPrev()}
          iconAfter={ChevronLeft}
        />

        <Button
          chromeless
          f={1}
          borderRadius="$10"
          circular
          onPress={() => handleGoNext()}
          iconAfter={ChevronRight}
        />
      </XStack>
    </>
  )
}
