import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import { Paragraph, Spacer, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HeaderFloating } from './HeaderFloating'

export const HeaderIndependent = ({ disableNew }: { disableNew?: boolean }) => {
  return (
    <>
      <ContainerLarge>
        <Header disableNew={disableNew} />
      </ContainerLarge>
      <HeaderFloating disableNew={disableNew} />
    </>
  )
}

export function Header({
  floating,
  disableNew,
  isHome,
}: {
  floating?: boolean
  disableNew?: boolean
  isHome?: boolean
}) {
  const { setNextTint } = useTint()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      py={floating ? 0 : '$2'}
      jc="space-between"
      p="relative"
      zi={1}
    >
      <XStack ai="center" space="$4">
        {isHome ? (
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 2} />
          </YStack>
        ) : (
          <NextLink href="/" passHref>
            <YStack cursor="pointer" tag="a" my={-20}>
              <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 2} />
            </YStack>
          </NextLink>
        )}

        {!disableNew && <AlphaButton />}
      </XStack>

      <XStack
        position="absolute"
        $sm={{
          display: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <NextLink href="/" passHref>
          <XStack pointerEvents="auto" tag="a" als="center">
            <LogoWords />
          </XStack>
        </NextLink>
      </XStack>

      <XStack pointerEvents="auto" tag="nav">
        <XStack ai="center">
          <NextLink href="/docs/intro/installation" passHref>
            <Paragraph
              fontFamily="$silkscreen"
              p="$2"
              px="$3"
              cursor="pointer"
              size="$3"
              opacity={0.5}
              hoverStyle={{ opacity: 1 }}
              tag="a"
            >
              Docs
            </Paragraph>
          </NextLink>

          <NextLink href="/blog" passHref>
            <Paragraph
              fontFamily="$silkscreen"
              p="$2"
              px="$3"
              cursor="pointer"
              size="$3"
              opacity={0.5}
              hoverStyle={{ opacity: 1 }}
              tag="a"
            >
              Blog
            </Paragraph>
          </NextLink>

          <Spacer size="$2" />

          <ThemeToggle chromeless={floating} />
        </XStack>
      </XStack>
    </XStack>
  )
}
