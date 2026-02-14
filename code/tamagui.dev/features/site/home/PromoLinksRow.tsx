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
      <Tooltip scope="promo-tooltip" offset={20} placement="bottom">
        <XGroup position="absolute" self="center" y={-80} rounded="$8" elevation="$2">
          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('Takeout — universal RN starter kit')}
          >
            <Link
              hoverStyle={{
                z: 100,
              }}
              href="/takeout"
            >
              <XGroup.Item>
                <TakeoutButton mr={-1} elevation={0} />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('Bento — Free + paid pre-made UI')}
          >
            <Link
              hoverStyle={{
                z: 100,
              }}
              href="/bento"
            >
              <XGroup.Item>
                <BentoButton mr={-1} elevation={0} />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="promo-tooltip"
            asChild
            onMouseEnter={() => setLabel('Add Even — Expert React Native developers')}
          >
            <Link
              hoverStyle={{
                z: 100,
              }}
              href="https://addeven.com"
              target="_blank"
            >
              <XGroup.Item>
                <ConsultingButton elevation={0} />
              </XGroup.Item>
            </Link>
          </Tooltip.Trigger>
        </XGroup>

        <Tooltip.Content
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
          <Tooltip.Arrow />
          <Paragraph size="$3">{label}</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </TooltipGroup>
  )
}
