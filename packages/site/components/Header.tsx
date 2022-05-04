import { LogoWords, TamaguiLogo } from '@components/TamaguiLogo'
import { ThemeToggle } from '@components/ThemeToggle'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Paragraph, Spacer, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { tints, useTint } from './ColorToggleButton'
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

export function Header({ floating, disableNew }: { floating?: boolean; disableNew?: boolean }) {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const { setNextTint, setTint } = useTint()

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      jc="space-between"
      pos="relative"
      py={floating ? 0 : '$2'}
      zi={1}
    >
      <XStack ai="center" space="$4">
        {isHome ? (
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 1.5} />
          </YStack>
        ) : (
          <NextLink href="/" passHref>
            <YStack cursor="pointer" tag="a" my={-20}>
              <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 1.5} />
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
            <LogoWords onHoverLetter={(i) => setTint(tints[i])} />
          </XStack>
        </NextLink>
      </XStack>

      <XStack pointerEvents="auto" tag="nav">
        <XStack ai="center" space="$2">
          <NextLink href="/docs/intro/installation" passHref>
            <Paragraph
              fontFamily="$silkscreen"
              p="$2"
              letterSpacing={2}
              cursor="pointer"
              size="$4"
              o={0.7}
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
              letterSpacing={2}
              cursor="pointer"
              size="$4"
              o={0.7}
              hoverStyle={{ opacity: 1 }}
              tag="a"
            >
              Blog
            </Paragraph>
          </NextLink>

          <ThemeToggle ml="$2" chromeless={floating} />
        </XStack>
      </XStack>
    </XStack>
  )
}
