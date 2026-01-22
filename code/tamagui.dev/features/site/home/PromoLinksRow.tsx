import { useState } from 'react'
import { Paragraph, Theme, Tooltip, TooltipGroup, XGroup } from 'tamagui'
import { Link } from '~/components/Link'
import { BentoButton } from '../BentoButton'
import { ConsultingButton } from '../ConsultingButton'
import { TakeoutButton } from '../TakeoutButton'

const tooltipDelay = { open: 0, close: 150 }

export const PromoLinksRow = () => {
  const [label, setLabel] = useState('')

  return (
    <TooltipGroup delay={tooltipDelay}>
      <Tooltip scope="promo-tooltip" offset={12} placement="bottom">
        <XGroup position="absolute" self="center" y={-80} rounded="$8">
          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('Takeout — universal RN starter kit')}
          >
            <Link href="/takeout">
              <XGroup.Item>
                <TakeoutButton />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('Bento — Free + paid pre-made UI')}
          >
            <Link href="/bento">
              <XGroup.Item>
                <BentoButton />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('AddEven — Expert React Native developers')}
          >
            <Link href="https://addeven.com" target="_blank">
              <XGroup.Item>
                <ConsultingButton />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>
        </XGroup>

        <Tooltip.Content
          enableAnimationForPositionChange
          transition="quick"
          bg="$background"
          elevation="$2"
          rounded="$4"
          px="$2.5"
          py="$1"
          enterStyle={{ y: -4, opacity: 0 }}
          exitStyle={{ y: -4, opacity: 0 }}
        >
          <Tooltip.Arrow />
          <Paragraph size="$3">{label}</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </TooltipGroup>
  )
}
