import { Button } from '@tamagui/button'
import { Menu, Moon, Search, Sun, X } from '@tamagui/lucide-icons'
import { useUserTheme } from '@tamagui/one-theme'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useEffect, useRef, useState } from 'react'
import { ScrollView, Spacer, useMedia, useWindowDimensions, View, XStack } from 'tamagui'
import { Link } from 'vxs'
import { Drawer } from '~/components/Drawer'
import { OneLogo } from '~/features/brand/Logo'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { GithubIcon } from '~/features/icons/GithubIcon'

import { useContext } from 'react'

import { SearchContext } from '~/features/search/SearchContext'

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

  useEffect(() => {
    if (isMenuOpen) {
      gtSm && setIsMenuOpen(false)
    }
    return undefined
  }, [gtSm])
  const searchRef = useRef()
  const { onOpen, onInput } = useContext(SearchContext)

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (
        !searchRef.current ||
        searchRef.current !== document.activeElement ||
        !onInput
      ) {
        return
      }
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        return
      }
      onInput(event)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onInput, searchRef])

  const { height, width } = useWindowDimensions()

  return (
    <>
      <XStack
        ref={scrollParentRef}
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
            gap: '$2',
          }}
        >
          <Button chromeless circular size="$4" onPress={onOpen} ref={searchRef}>
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
              <GithubIcon width={gtSm ? 36 : 24} height={gtSm ? 36 : 24} />
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
          <Button
            circular
            ml="$2"
            onPress={() => setIsMenuOpen((prev) => !prev)}
            $gtSm={{
              display: 'none',
            }}
          >
            <Button.Icon>
              {isMenuOpen ? (
                <X width={16} height={16} color="$color12" />
              ) : (
                <Menu width={16} height={16} color="$color12" />
              )}
            </Button.Icon>
          </Button>
        </XStack>
      </XStack>
      <Drawer
        open={isMenuOpen}
        onOpenChange={() => {
          setIsMenuOpen((prev) => !prev)
        }}
      >
        {/* <Drawer.Portal> */}
        <Drawer.Overlay
          height={height}
          width={width + 100}
          animation="200ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Drawer.Swipeable>
          <Drawer.Content
            height={height}
            width={260}
            alignItems="flex-start"
            justifyContent="flex-start"
            backgroundColor="$background"
            gap="$4"
            enterStyle={{ x: -260 }}
            exitStyle={{ x: -260 }}
          >
            <ScrollView
              key="nav-scroll"
              pb="$20"
              width="100%"
              height="100%"
              showsVerticalScrollIndicator={false}
              paddingRight="$4"
            >
              <Spacer size="$3" />
              <DocsMenuContents />
            </ScrollView>
          </Drawer.Content>
        </Drawer.Swipeable>
        {/* </Drawer.Portal> */}
      </Drawer>
    </>
  )
}
