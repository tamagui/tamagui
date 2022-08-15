import { LogoWords } from '@tamagui/logo'
import { Link, useUrl } from '@tamagui/unagi'
import React from 'react'
import { Button, Paragraph, Text, VisuallyHidden, XStack, YStack } from 'tamagui'

import { CalloutButton } from './header/CalloutButton.server'
import { HeaderButtonsGroup } from './header/HeaderButtonsGroup.client'
import { HeaderLogo } from './header/HeaderLogo.client'
import { GithubIcon } from './icons/GithubIcon.server'

export function Header({ floating, disableNew }: { floating?: boolean; disableNew?: boolean }) {
  const url = useUrl()
  const isTakeout = url.pathname.startsWith('/takeout')

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
      <XStack ai="center" space="$6">
        <HeaderLogo floating={floating} />

        <HeaderButtonsGroup />

        {/* {isTakeout && (
          <Link to="/takeout">
            <Button size="$2">Back to takeout</Button>
          </Link>
        )} */}
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
        <Link to="/">
          <XStack pointerEvents="auto" als="center">
            <LogoWords
            // onHoverLetter={(i) => setTint(tints[i])}
            />
          </XStack>
        </Link>
      </XStack>

      {/* minwidth to prevent layout shift */}
      <XStack jc="flex-end" miw={204} $xxs={{ miw: 150 }} pointerEvents="auto" tag="nav">
        {isTakeout ? (
          <XStack ai="center" space="$2">
            <Link to="/signin">
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                $xxs={{
                  display: 'none',
                }}
              >
                Login
              </Paragraph>
            </Link>

            <Link to="/takeout/purchase">
              <Button fontFamily="$silkscreen" size="$3">
                Purchase
              </Button>
            </Link>
          </XStack>
        ) : (
          <XStack ai="center" space="$2">
            <Link to="/docs/intro/installation">
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                pressStyle={{ opacity: 0.5 }}
              >
                Docs
              </Paragraph>
            </Link>

            <Link to="/blog">
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                letterSpacing={2}
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                pressStyle={{ opacity: 0.5 }}
                $xxs={{
                  display: 'none',
                }}
              >
                Blog
              </Paragraph>
            </Link>

            {!disableNew && <CalloutButton />}

            <Link to="https://github.com/tamagui/tamagui">
              <YStack p="$2" opacity={0.65} hoverStyle={{ opacity: 1 }} target="_blank">
                <VisuallyHidden>
                  <Text>Github</Text>
                </VisuallyHidden>
                <GithubIcon width={23} />
              </YStack>
            </Link>
          </XStack>
        )}
      </XStack>
    </XStack>
  )
}
