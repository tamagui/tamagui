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
    <YStack ref={rootRef} p="4" gap="4" id="tooltip-ssr-root">
      <YStack height={120} />

      <TooltipGroup delay={tooltipDelay}>
        <Tooltip scope="promo-tooltip" offset={20} placement="bottom">
          <XStack gap="2" justifyContent="center" id="tip-triggers">
            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.a)}
            >
              <XStack id="tip-trigger-a">
                <Button size="small">Starter Kit</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.b)}
            >
              <XStack id="tip-trigger-b">
                <Button size="small">Copy-Paste UI</Button>
              </XStack>
            </Tooltip.Trigger>

            <Tooltip.Trigger
              scope="promo-tooltip"
              asChild
              onMouseEnter={() => setLabel(LABELS.c)}
            >
              <XStack id="tip-trigger-c">
                <Button size="small">Hire Us</Button>
              </XStack>
            </Tooltip.Trigger>
          </XStack>

          <Tooltip.Content
                                                id="tip-content" scope="promo-tooltip" animatePosition transition="medium" bg="background" rounded="4" px="$2.5" py="1" y="enter:-4px exit:-4px" opacity="enter:0 exit:0" elevation="$2"
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
