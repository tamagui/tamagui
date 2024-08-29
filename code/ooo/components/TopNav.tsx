import { Button } from '@tamagui/button'
import { Menu, Moon, Search, Sun, X } from '@tamagui/lucide-icons'
import { useUserTheme } from '@tamagui/one-theme'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useEffect, useRef, useState } from 'react'
import { Stack, useMedia, View, XStack } from 'tamagui'
import { Link } from 'vxs'
import { OneLogo } from '~/features/brand/Logo'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { Container, ContainerDocs } from '~/features/site/Containers'

export const TopNav = () => {
  // While the overlay is open, disable body scroll.
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const scrollParentRef = useRef<HTMLDivElement>(null)
  const [{ resolvedTheme }, setTheme] = useUserTheme()
  const { gtSm } = useMedia()

  useEffect(() => {
    if (isMenuOpen) {
      const preferredScrollParent = scrollParentRef.current!
      disableBodyScroll(preferredScrollParent)
      return () => enableBodyScroll(preferredScrollParent)
    }
    return undefined
  }, [isMenuOpen])
  return (
    <>
      <XStack
        jc="space-between"
        ai="center"
        px="$5"
        py="$2"
        $gtSm={{
          jc: 'flex-end',
          top: 16,
        }}
      >
        <XStack
          gap="$3"
          left="$0"
          ai="center"
          $gtSm={{
            display: 'none',
          }}
        >
          <Button circular onPress={() => setIsMenuOpen((prev) => !prev)}>
            <Button.Icon p="$4">
              {isMenuOpen ? (
                <X width={16} height={16} color="$color12" />
              ) : (
                <Menu width={16} height={16} color="$color12" />
              )}
            </Button.Icon>
          </Button>
          <View
            group
            containerType="normal"
            pos="relative"
            mx="auto"
            pointerEvents="none"
            $gtSm={{
              display: 'none',
            }}
          >
            <OneLogo size={gtSm ? 1 : 0.5} animate />
          </View>
        </XStack>

        <XStack
          ai="center"
          jc="center"
          gap="$0"
          right="$0"
          $gtSm={{
            gap: '$4',
          }}
        >
          <Button chromeless circular size="$4">
            <Search width={24} height={24} color="$color12" strokeWidth={2} />
          </Button>
          <Button
            circular
            chromeless
            onPress={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            size="$4"
          >
            {resolvedTheme === 'light' ? <Moon /> : <Sun />}
          </Button>

          <Link target="_blank" href="https://github.com/tamagui/tamagui">
            <XStack
              ai="center"
              group
              containerType="normal"
              gap="$2"
              p="$2"
              opacity={0.9}
              hoverStyle={{ opacity: 1 }}
            >
              <GithubIcon width={36} height={36} />
              {/* <SizableText
          $md={{ display: 'none' }}
          size="$3"
          color="$color12"
          o={0.5}
          $group-hover={{
            o: 0.8,
          }}
        >
          Github
        </SizableText> */}
            </XStack>
          </Link>
        </XStack>
      </XStack>
      {isMenuOpen ? <Stack tag="aside" ref={scrollParentRef}></Stack> : null}
    </>
  )
}
