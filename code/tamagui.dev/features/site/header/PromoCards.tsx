import { Box, Brush } from '@tamagui/lucide-icons'
import { styled, YStack } from 'tamagui'
import { BentoIcon } from '../../icons/BentoIcon'
import { TakeoutIcon } from '../../icons/TakeoutIcon'
import { TooltipLabelLarge } from './TooltipLabelLarge'

const Card = styled(YStack, {
  maxHeight: 120,
  maxWidth: 'calc(min(100%, 257px))',
  flex: 1,
  br: '$4',
  borderWidth: 0.5,
  borderColor: '$color4',
})

export const PromoCards = ({
  less,
  disableAutoRenew,
}: { less?: boolean; disableAutoRenew?: boolean }) => {
  return (
    <>
      <Card>
        <TooltipLabelLarge
          icon={<TakeoutIcon />}
          href="/takeout"
          title="Takeout"
          subtitle="Starter kit for making universal apps fast."
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
          subtitle="OSS and paid copy-paste components and screens."
        />
      </Card>

      <Card>
        <PromoCardTheme />
      </Card>

      {!less && (
        <>
          <Card opacity={disableAutoRenew ? 0.1 : 1}>
            <TooltipLabelLarge
              href="/theme"
              icon={null as any}
              title="#takeout"
              subtitle="Access to private Discord chat room."
            />
          </Card>

          <Card>
            <TooltipLabelLarge
              href="/takeout"
              icon={<Box />}
              title="Assets"
              subtitle="Scripts to easily add fonts and icon packs."
            />
          </Card>
        </>
      )}
    </>
  )
}

export const PromoCardTheme = () => {
  return (
    <TooltipLabelLarge
      href="/theme"
      icon={<Brush size={20} />}
      title="Theme"
      subtitle="Generate themes using a custom AI."
    />
  )
}
