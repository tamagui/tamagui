import { H2, Paragraph, styled, XStack, YStack } from 'tamagui'
import { ThemeTintAlt } from '@tamagui/logo'
import { ArrowRight } from '@tamagui/lucide-icons'

import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'

const HighlightText = styled(Paragraph, {
  fontSize: 32,
  fontWeight: '700',
  color: '$color10',
  style: {
    lineHeight: '1.2',
  },

  $sm: {
    fontSize: 40,
  },
})

const CTAContainer = styled(YStack, {
  bg: '$color2',
  rounded: '$8',
  p: '$8',
  borderWidth: 1,
  borderColor: '$color4',
  position: 'relative',
  overflow: 'hidden',
  style: {
    backdropFilter: 'blur(16px)',
  },

  '$theme-dark': {
    bg: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
})

const PrimaryButton = styled(YStack, {
  rounded: '$6',
  px: '$5',
  py: '$3.5',
  cursor: 'pointer',
  items: 'center',
  justify: 'center',
  bg: '$blue10',
  shadowColor: '$blue11',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  style: {
    transition: 'all 200ms ease',
  },

  hoverStyle: {
    bg: '$blue11',
    shadowOpacity: 0.4,
    y: -2,
  },

  pressStyle: {
    bg: '$blue12',
    y: 0,
  },
})

const SecondaryButton = styled(YStack, {
  rounded: '$6',
  px: '$5',
  py: '$3.5',
  cursor: 'pointer',
  items: 'center',
  justify: 'center',
  bg: '$color2',
  borderWidth: 1,
  borderColor: '$color6',
  style: {
    transition: 'all 200ms ease',
  },

  hoverStyle: {
    bg: '$color3',
    borderColor: '$color8',
  },

  pressStyle: {
    bg: '$color4',
  },
})

const GlowOrb = styled(YStack, {
  position: 'absolute',
  width: 400,
  height: 400,
  rounded: 999,
  opacity: 0.08,
  pointerEvents: 'none',
})

export function TakeoutCTA() {
  return (
    <YStack gap="$6" py="$12" px="$4" maxW={900} self="center" width="100%">
      <CTAContainer items="center" gap="$6" py="$10">
        <ThemeTintAlt>
          <GlowOrb
            bg="$color8"
            t={-200}
            l={-200}
            style={{ filter: 'blur(100px)' } as any}
          />
        </ThemeTintAlt>
        <ThemeTintAlt offset={3}>
          <GlowOrb
            bg="$color8"
            b={-200}
            r={-200}
            style={{ filter: 'blur(100px)' } as any}
          />
        </ThemeTintAlt>

        <YStack items="center" gap="$4" z={1}>
          <H2
            fontSize={32}
            fontWeight="700"
            text="center"
            color="$color12"
            style={{ lineHeight: '1.2' }}
            $sm={{ fontSize: 40 }}
          >
            Ready to{' '}
            <ThemeTintAlt>
              <HighlightText tag="span">ship?</HighlightText>
            </ThemeTintAlt>
          </H2>
          <Paragraph
            fontSize={16}
            color="$color11"
            text="center"
            maxW={500}
            style={{ lineHeight: '1.6' }}
            $sm={{ fontSize: 18 }}
          >
            Get started with Takeout and build your next app in record time.
          </Paragraph>
        </YStack>

        <XStack gap="$4" mt="$2" flexWrap="wrap" justify="center" z={1}>
          <Link href="https://github.com/tamagui/takeout" target="_blank">
            <PrimaryButton>
              <XStack gap="$2.5" items="center">
                <GithubIcon width={20} height={20} color="white" />
                <Paragraph fontSize={16} fontWeight="600" color="white">
                  View on GitHub
                </Paragraph>
                <ArrowRight size={16} color="white" />
              </XStack>
            </PrimaryButton>
          </Link>

          <Link href="/docs/guides/takeout">
            <SecondaryButton>
              <Paragraph fontSize={16} fontWeight="600" color="$color12">
                Read the Docs
              </Paragraph>
            </SecondaryButton>
          </Link>
        </XStack>

        <Paragraph fontSize={13} color="$color10" mt="$2" z={1}>
          MIT Licensed - Free Forever
        </Paragraph>
      </CTAContainer>
    </YStack>
  )
}
