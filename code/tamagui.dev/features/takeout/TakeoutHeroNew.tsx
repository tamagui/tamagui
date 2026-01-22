import { ThemeTintAlt } from '@tamagui/logo'
import { Check, Copy, ExternalLink } from '@tamagui/lucide-icons'
import { Suspense, lazy } from 'react'
import { Button, Paragraph, Theme, XStack, YStack, styled } from 'tamagui'

import { ErrorBoundary } from '~/components/ErrorBoundary'
import { ButtonLink, Link } from '~/components/Link'
import { PurchaseButton } from '~/features/site/purchase/helpers'
import type { PromoConfig } from '~/features/site/purchase/promoConfig'
import { useClipboard } from '~/hooks/useClipboard'
import { TakeoutLogo } from './TakeoutLogo'
import { SubTitle } from '../../components/SubTitle'

const TakeoutBox3D = lazy(() => import('./TakeoutBox3D'))

// Prominent command box like in the reference image - centered under subtitle
const CommandBoxLarge = styled(XStack, {
  rounded: '$10',
  px: '$6',
  py: '$4',
  bg: '$color3',
  items: 'center',
  justify: 'center',
  gap: '$3',
  cursor: 'pointer',
  borderWidth: 0.5,
  borderColor: '$color4',

  hoverStyle: {
    bg: '$color3',
    borderColor: '$color6',
  },

  pressStyle: {
    bg: '$color4',
  },
})

const INSTALL_COMMAND = 'bunx create-takeout@latest'

// promo badge - floating pill at top center
const PromoBadgeContainer = styled(XStack, {
  position: 'absolute',
  transition: 'quickest',
  t: 30,
  l: '50%',
  x: '-50%',
  z: 20,
  rounded: '$10',
  px: '$4',
  py: '$2',
  items: 'center',
  justify: 'center',
  gap: '$2',
  cursor: 'pointer',
  borderWidth: 0.5,

  hoverStyle: {
    borderColor: '$color6',
  },

  pressStyle: {
    scale: 0.98,
    opacity: 0.9,
  },
})

// Prominent centered install command (like in reference image)
function InstallCommand() {
  const { onCopy, hasCopied } = useClipboard(INSTALL_COMMAND, { timeout: 2000 })

  return (
    <CommandBoxLarge onPress={onCopy}>
      <Paragraph fontFamily="$mono" fontSize={14} color="$color10">
        $
      </Paragraph>
      <Paragraph fontFamily="$mono" fontSize={14} color="$color12">
        {INSTALL_COMMAND}
      </Paragraph>
      {hasCopied ? (
        <Check size={18} color="var(--color10)" />
      ) : (
        <Copy size={18} color="var(--color10)" />
      )}
    </CommandBoxLarge>
  )
}

export function TakeoutHeroNew({
  onBuyPress,
  activePromo,
}: {
  onBuyPress?: () => void
  activePromo?: PromoConfig | null
}) {
  return (
    <YStack items="center" gap="$8" pt="$10" pb="$8" px="$4" position="relative">
      {/* Promo badge - floating pill at top center, opens same modal as buy button */}
      {activePromo && onBuyPress && (
        <Theme name={activePromo.theme || 'green'}>
          <PromoBadgeContainer
            onPress={onBuyPress}
            bg="$color3"
            borderColor="$color5"
            style={{
              background: 'linear-gradient(180deg, var(--color2) 0%, var(--color1) 100%)',
            }}
          >
            <Paragraph fontFamily="$mono" fontWeight="700" size="$4" color="$color11">
              {activePromo.label}
            </Paragraph>
            <Paragraph fontFamily="$mono" size="$3" color="$color10">
              {activePromo.description}
            </Paragraph>
          </PromoBadgeContainer>
        </Theme>
      )}

      {/* Buy buttons */}
      {onBuyPress && (
        <XStack gap="$3" position="absolute" t={30} r="2%" z={10}>
          <ButtonLink
            href="https://github.com/tamagui/takeout-free"
            target="_blank"
            size="$4"
          >
            Free
            <ExternalLink size={10} opacity={0.5} />
          </ButtonLink>
          <PurchaseButton onPress={onBuyPress} size="$4" theme="accent">
            Pro
          </PurchaseButton>
        </XStack>
      )}

      {/* 3D Rotating Takeout Box */}
      <YStack
        position="absolute"
        pointerEvents="none"
        t={260}
        r={20}
        width={400}
        height={400}
        $sm={{ scale: 0.6, t: 220, r: -100 }}
        z={100}
      >
        <Suspense fallback={null}>
          <ErrorBoundary noMessage>
            <TakeoutBox3D />
          </ErrorBoundary>
        </Suspense>
      </YStack>

      <YStack gap="$6" items="center" maxW={800} width="100%" mt="$4">
        {/* Main headline */}
        <TakeoutLogo />

        {/* Description under logo */}
        <>
          <YStack gap="$3" maxW={720} mt={-20}>
            <SubTitle size="$8" text="center" $sm={{ size: '$6' }}>
              Takeout makes React Native + web as well-structured, fast, and simple as
              possible, and funds the OSS development of Tamagui.
            </SubTitle>
          </YStack>
        </>

        {/* Install command - prominent like in reference */}
        <InstallCommand />

        {/* CTA buttons */}
        <XStack gap="$3" flexWrap="wrap" items="center" justify="center">
          <Link href="https://takeout.tamagui.dev/docs/introduction" target="_blank">
            <ThemeTintAlt>
              <Button
                size="$4"
                bg="$color5"
                borderWidth={0.5}
                borderColor="$color7"
                cursor="pointer"
                hoverStyle={{ bg: '$color6', borderColor: '$color8' }}
                pressStyle={{ bg: '$color7' }}
              >
                <Button.Text fontFamily="$mono" color="$color12">
                  Docs
                </Button.Text>
              </Button>
            </ThemeTintAlt>
          </Link>

          <Link href="https://takeout.tamagui.dev" target="_blank">
            <Button
              size="$4"
              bg="$color3"
              borderWidth={0.5}
              borderColor="$color6"
              cursor="pointer"
              hoverStyle={{ bg: '$color4', borderColor: '$color8' }}
              pressStyle={{ bg: '$color5' }}
            >
              <Button.Text fontFamily="$mono" color="$color12">
                Demo (web)
              </Button.Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}
