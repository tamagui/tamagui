import { Menu, Moon, Search, Sun, X } from '@tamagui/lucide-icons'
import { useUserTheme } from '@tamagui/one-theme'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import {
  AnimatePresence,
  ScrollView,
  Spacer,
  Stack,
  useMedia,
  useWindowDimensions,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { Link, router } from 'vxs'
import { OneLogo } from '~/features/brand/Logo'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { Drawer } from '~/components/Drawer'

import { Search as SearchIcon } from '@tamagui/lucide-icons'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import type { ButtonProps } from 'tamagui'
import { Button, SizableText, TooltipSimple } from 'tamagui'

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

export const SearchButton = memo((props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext)

  const ref = useRef()

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (!ref || ref.current !== document.activeElement || !onInput) {
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
  }, [onInput, ref])

  return (
    <TooltipSimple groupId="header-actions-search" label="Search">
      <Button
        aria-label="Search docs"
        ref={ref as any}
        onPress={onOpen}
        gap="$1"
        icon={SearchIcon}
        // dont hide this on touchables to avoid layout shifts...
        iconAfter={
          <SizableText size="$1" mx="$1" $sm={{ maw: 0, ov: 'hidden', mx: -1 }} o={0.25}>
            /
          </SizableText>
        }
        {...props}
      />
    </TooltipSimple>
  )
})
