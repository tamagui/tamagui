import React, { useState, useRef } from 'react'
import { Paragraph, Tooltip, TooltipGroup, YStack, XStack, Button } from 'tamagui'

// matches PromoLinksRow pattern exactly:
// scoped tooltip, multiple triggers, asChild, nested structure, animatePosition

type NavId = 'a' | 'b' | 'c'
const LABELS: Record<NavId, string> = {
  a: 'Takeout — universal RN starter kit',
  b: 'Bento — Free + paid pre-made UI',
  c: 'Add Even — Expert React Native developers',
}

const tooltipDelay = { open: 0, close: 150 }

export default function TooltipSSRTest() {
  const [label, setLabel] = useState('')
  const rootRef = useRef<any>(null)

  React.useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true')
  }, [])

  return (
    <YStack ref={rootRef} p="$4" gap="$4" id="tooltip-ssr-root">
      <YStack height={120} />

      <TooltipGroup delay={tooltipDelay}>
        <Tooltip scope="promo-tooltip" offset={20} placement="bottom">
          <XStack gap="$2" id="tip-triggers" justifyContent="center">
            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.a)}
            >
              <XStack id="tip-trigger-a">
                <Button size="$3">Starter Kit</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.b)}
            >
              <XStack id="tip-trigger-b">
                <Button size="$3">Copy-Paste UI</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.c)}
            >
              <XStack id="tip-trigger-c">
                <Button size="$3">Hire Us</Button>
              </XStack>
            </Tooltip.Trigger>
          </XStack>

          <Tooltip.Content
            id="tip-content"
            scope="promo-tooltip"
            animatePosition
            transition="medium"
            bg="$background"
            elevation="$2"
            rounded="$4"
            px="$2.5"
            py="$1"
            enterStyle={{ y: -4, opacity: 0 }}
            exitStyle={{ y: -4, opacity: 0 }}
          >
            <Tooltip.Arrow scope="promo-tooltip" id="tip-arrow" />
            <Paragraph id="tip-label" size="$3">
              {label}
            </Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </TooltipGroup>
    </YStack>
  )
}
