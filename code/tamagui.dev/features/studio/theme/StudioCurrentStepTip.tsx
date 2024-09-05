import { Lightbulb, X } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Button, Popover, Theme } from 'tamagui'

import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'

export function StudioCurrentStepTip() {
  const store = useThemeBuilderStore()
  const Tip = store.currentSection.tip

  // open after a bit of a delay because animations need to settle
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (store.showExplanationSteps === false) {
      return
    }
    if (!Tip) {
      setShow(false)
    } else {
      const tm = setTimeout(() => {
        setShow(true)
      }, 1000)

      return () => {
        clearTimeout(tm)
      }
    }
  }, [Tip])

  const button = (
    <Button
      cursor="default"
      pressTheme={false}
      hoverTheme={!Tip}
      size="$2"
      chromeless
      scaleIcon={1.2}
      circular
      icon={Lightbulb}
      my="$-1"
      ml="$2"
      onPress={() => {
        setShow(!show)
      }}
    />
  )

  if (!Tip) {
    return null
  }

  return (
    <Popover open={show} size="$5" allowFlip placement="bottom">
      <Popover.Trigger asChild>{button}</Popover.Trigger>

      <Theme name="yellow">
        <Popover.Content
          trapFocus={false}
          borderWidth={2}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          maw={500}
          theme="surface2"
          animation={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={2} borderColor="$borderColor" />

          <Tip />

          <Button
            size="$2"
            circular
            pos="absolute"
            t="$-3"
            r="$-3"
            icon={X}
            onPress={() => {
              setShow(false)
            }}
          ></Button>
        </Popover.Content>
      </Theme>
    </Popover>
  )
}
