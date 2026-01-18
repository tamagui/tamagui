import { ThemeTintAlt } from '@tamagui/logo'
import { Check, Copy } from '@tamagui/lucide-icons'
import { Suspense, lazy } from 'react'
import { Button, Paragraph, XGroup, XStack, YStack, styled } from 'tamagui'

import { ErrorBoundary } from '~/components/ErrorBoundary'
import { ButtonLink, Link } from '~/components/Link'
import { PurchaseButton } from '~/features/site/purchase/helpers'
import { useClipboard } from '~/hooks/useClipboard'
import { TakeoutLogo } from './TakeoutLogo'

const TakeoutBox3D = lazy(() => import('./TakeoutBox3D'))

// Prominent command box like in the reference image - centered under subtitle
const CommandBoxLarge = styled(XStack, {
  rounded: '$10',
  px: '$6',
  py: '$4',
  bg: '$color4',
  items: 'center',
  justify: 'center',
  gap: '$3',
  cursor: 'pointer',
  borderWidth: 1,
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
}: {
  onBuyPress?: () => void
}) {
  return (
    <YStack items="center" gap="$8" pt="$10" pb="$8" px="$4" position="relative">
      {/* Buy buttons */}
      {onBuyPress && (
        <XGroup position="absolute" t={30} r="2%" z={10}>
          <XGroup.Item>
            <ButtonLink
              href="https://github.com/tamagui/takeout-free"
              target="_blank"
              size="$4"
            >
              Free
            </ButtonLink>
          </XGroup.Item>
          <XGroup.Item>
            <PurchaseButton onPress={onBuyPress} size="$4" theme="accent">
              Pro
            </PurchaseButton>
          </XGroup.Item>
        </XGroup>
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

      <YStack gap="$6" items="center" maxW={800} width="100%">
        {/* Main headline */}
        <TakeoutLogo />

        {/* Description under logo */}
        <ThemeTintAlt>
          <YStack gap="$3" maxW={700} mt="$4">
            <Paragraph
              className="text-wrap-balance"
              size="$6"
              $sm={{ size: '$5' }}
              text="center"
            >
              Takeout is a full-stack, cross-platform starter kit for building modern web
              and mobile apps with React Native. It funds the OSS development of Tamagui.
            </Paragraph>
          </YStack>
        </ThemeTintAlt>

        {/* Install command - prominent like in reference */}
        <InstallCommand />

        {/* CTA buttons */}
        <XStack gap="$3" flexWrap="wrap" items="center" justify="center">
          <Link href="https://takeout.tamagui.dev/docs/introduction" target="_blank">
            <ThemeTintAlt>
              <Button
                size="$4"
                bg="$color5"
                borderWidth={1}
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
              borderWidth={1}
              borderColor="$color6"
              cursor="pointer"
              hoverStyle={{ bg: '$color4', borderColor: '$color8' }}
              pressStyle={{ bg: '$color5' }}
            >
              <Button.Text fontFamily="$mono" color="$color12">
                Demo Website
              </Button.Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}
