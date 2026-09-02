import { useEffect, useState } from 'react'
import {
  Paragraph,
  styled,
  Tooltip,
  TooltipGroup,
  withStaticProperties,
  XStack,
  YStack,
} from 'tamagui'

/**
 * regression case for withStaticProperties mutating shared compound components.
 *
 * tamagui.dev's promo row tooltip teleported once per page load: a lazy-loaded
 * bento chunk ran withStaticProperties(Tooltip, { Content: styled(...) }),
 * which used to Object.assign onto the shared Tooltip — swapping
 * Tooltip.Content's identity globally. the next render of any open tooltip saw
 * a new element type, React remounted the content subtree, and the fresh
 * PopperContent wrote its position directly (no animation) — a single-frame
 * teleport to the new anchor.
 *
 * window.__clobberTooltip (set below) simulates the lazy chunk. after the
 * test calls it, crossing triggers must still glide (no remount, no teleport).
 */

const labels = ['Alpha label one', 'Beta label two which is longer', 'Gamma three']

export function TooltipStaticClobberCase() {
  const [label, setLabel] = useState('')

  useEffect(() => {
    // exposed for the test: simulates bento's AvatarsTooltip module executing
    // while the tooltip is open (a lazy chunk load moves no pointer)
    ;(window as any).__clobberTooltip = () => {
      withStaticProperties(Tooltip, {
        Content: styled(Tooltip.Content, {
          padding: 0,
          backgroundColor: 'red',
        }) as any,
      })
    }
    return () => {
      delete (window as any).__clobberTooltip
    }
  }, [])

  return (
    <YStack flex={1} items="center" justify="center" gap="6" bg="background">
      <TooltipGroup delay={{ open: 0, close: 150 }}>
        <Tooltip scope="clobber-tooltip" offset={16} placement="bottom" open={!!label}>
          {/* triggers touch (like the promo row XGroup) so crossing never
              closes the tooltip */}
          <XStack>
            {labels.map((l, i) => (
              <Tooltip.Trigger key={l} scope="clobber-tooltip" asChild="except-style">
                <YStack
                  data-testid={`clobber-icon-${i}`}
                  role="button"
                  width={30}
                  height={30}
                  items="center"
                  justify="center"
                  bg="color4"
                  rounded="2"
                  onMouseEnter={() => setLabel(l)}
                  onMouseLeave={() => setLabel((prev) => (prev === l ? '' : prev))}
                >
                  <Paragraph size="1">{i}</Paragraph>
                </YStack>
              </Tooltip.Trigger>
            ))}
          </XStack>

          <Tooltip.Content
            animatePosition
            transition={{
              enter: 'quickest',
              exit: '0ms',
              preset: 'quickest',
              properties: 'transform, opacity',
            }}
            y="0 enter:-3px exit:-3px"
            opacity="1 enter:0 exit:0"
          >
            <Paragraph size="2">{label}</Paragraph>
          </Tooltip.Content>
        </Tooltip>
      </TooltipGroup>
    </YStack>
  )
}
