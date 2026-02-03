import { Box, Brush, MessageCircle } from '@tamagui/lucide-icons'
import { styled, YStack } from 'tamagui'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { TooltipLabelLarge } from './TooltipLabelLarge'

const Card = styled(YStack, {
  maxH: 120,
  width: 'calc(50% - 6px)',
  flex: 1,
  flexBasis: 'auto',
  rounded: '$4',
  borderWidth: 0.5,
  borderColor: '$color4',

  $gtXs: {
    width: 'auto',
    maxW: 'calc(min(100%, 257px))',
  },
})

export const PromoCards = ({ less }: { less?: boolean }) => {
  return (
    <>
      <Card>
        <TooltipLabelLarge
          icon={<TakeoutIcon />}
          href="/takeout"
          title="Takeout v1"
          subtitle="Next.js + Expo with Supabase, tRPC, Vercel."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          icon={<TakeoutIcon />}
          href="/takeout"
          title="Takeout v2"
          subtitle="One framework, Zero sync, SST/Uncloud IaC, Agents."
        />
      </Card>

      <Card>
        <TooltipLabelLarge
          href="/bento"
          icon={
            <YStack y={-2}>
              <BentoIcon />
            </YStack>
          }
          title="Bento"
          subtitle="OSS and paid copy-paste components."
        />
      </Card>

      <Card>
        <PromoCardTheme />
      </Card>

      <Card>
        <TooltipLabelLarge
          icon={
            <YStack>
              <MessageCircle size={20} />
            </YStack>
          }
          title="Discord"
          subtitle="Chat support in private Discord room."
        />
      </Card>

      {!less && (
        <Card>
          <TooltipLabelLarge
            href="/takeout"
            icon={<Box size={20} />}
            title="Assets"
            subtitle="Scripts to easily add fonts and icon packs."
          />
        </Card>
      )}
    </>
  )
}

export const PromoCardTheme = () => {
  return (
    <TooltipLabelLarge
      href="/theme"
      icon={<Brush y={-2} size={20} />}
      title="Theme"
      subtitle="Generate themes using a custom AI."
    />
  )
}
