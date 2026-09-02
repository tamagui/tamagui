import { Lightbulb, X } from '@tamagui/lucide-icons-2'
import { useEffect, useState } from 'react'
import { Popover, Theme } from 'tamagui'
import { Button } from '~/components/Button'

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
      size="2"
      variant="quiet"
      scaleIcon={1.2}
      circular
      icon={Lightbulb}
      my="-1"
      ml="2"
      onPress={() => {
        setShow(!show)
      }}
    />
  )

  if (!Tip) {
    return null
  }

  return (
    <Popover open={show} size="5" allowFlip placement="bottom">
      <Popover.Trigger asChild>{button}</Popover.Trigger>

      <Theme name="yellow">
        <Popover.Content
          trapFocus={false}
          borderWidth={2}
          borderColor="border-color"
          y="enter:-10px exit:-10px"
          opacity="enter:0 exit:0"
          backgroundColor="background"
          boxShadow="0 4px 12px shadow-color"
          maxW={500}
          transition={{
            preset: 'quickest',
            opacity: { preset: 'quickest', spring: { overshootClamping: true } },
          }}
        >
          <Popover.Arrow
            backgroundColor="background"
            borderWidth={2}
            borderColor="border-color"
          />

          <Tip />

          <Button
            size="2"
            circular
            position="absolute"
            t="-3"
            r="-3"
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
