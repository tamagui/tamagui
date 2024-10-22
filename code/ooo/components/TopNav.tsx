import { Search } from '@tamagui/lucide-icons'
import { useContext, useRef } from 'react'
import { Separator, styled, View, XStack, YStack } from 'tamagui'
import { Link } from 'one'
import { OneLogo } from '~/features/brand/Logo'
import { Status } from '~/features/docs/Status'
import { SearchContext } from '~/features/search/SearchContext'
import { HeaderMenu } from '~/features/site/HeaderMenu'
import { SocialLinksRow } from '~/features/site/SocialLinksRow'
import { ToggleThemeButton } from '~/features/theme/ThemeToggleButton'

const SimpleButton = styled(View, {
  pe: 'auto',
  w: 42,
  h: 42,
  ai: 'center',
  jc: 'center',
  br: '$10',

  hoverStyle: {
    bg: '$color3',
  },

  pressStyle: {
    bg: '$color2',
  },
})

export const TopNav = () => {
  const scrollParentRef = useRef<HTMLDivElement>(null)
  const { onOpen } = useContext(SearchContext)

  return (
    <>
      <HeaderMenu />

      <XStack
        ref={scrollParentRef}
        jc="space-between"
        ai="center"
        maw={1400}
        w="100%"
        zi={90_000}
        pe="none"
        mx="auto"
        $md={{
          px: '$5',
          py: '$3',
          y: 20,
        }}
        $gtMd={{
          jc: 'flex-end',
          top: 26,
          px: 25,
        }}
      >
        <XStack
          gap="$3"
          left="$0"
          ai="center"
          pe="auto"
          $gtMd={{
            display: 'none',
          }}
        >
          <Link href="/">
            <View
              group
              containerType="normal"
              pos="relative"
              mx="auto"
              pointerEvents="none"
              y={-2}
              $gtMd={{
                display: 'none',
              }}
            >
              <OneLogo size={0.5} animate />
            </View>
          </Link>
        </XStack>

        <XStack pe="none" ai="center" jc="center" gap="$1" f={1}>
          <XStack
            group="card"
            containerType="normal"
            ai="center"
            jc="flex-end"
            $sm={{ dsp: 'none' }}
            f={10}
          >
            <View
              animation="quickest"
              mt={2}
              pe="auto"
              hoverStyle={{
                y: -1,
              }}
              pressStyle={{
                y: 2,
              }}
            >
              <Link href="/docs/status">
                <Status cur="pointer" is="beta" />
              </Link>
            </View>

            <XStack pe="auto" y={-2} mx="$4">
              <Separator vertical />
              <SocialLinksRow />
              <Separator vertical />
            </XStack>
          </XStack>

          <XStack pe="none" ai="center" jc="flex-end" f={10} $gtSm={{ f: 0 }}>
            <SimpleButton marginTop={-3} mr={8} onPress={onOpen}>
              <Search width={24} height={24} color="$color13" strokeWidth={2} />
            </SimpleButton>

            <ToggleThemeButton />

            <YStack w={50} />
          </XStack>
        </XStack>
      </XStack>
    </>
  )
}
