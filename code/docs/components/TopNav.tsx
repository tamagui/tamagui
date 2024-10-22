import { Link } from 'one'
import { useRef } from 'react'
import { View, XStack, YStack } from 'tamagui'
import { OneLogo } from '~/features/brand/Logo'
import { ToggleThemeButton } from '~/features/theme/ThemeToggleButton'

export const TopNav = () => {
  const scrollParentRef = useRef<HTMLDivElement>(null)

  return (
    <>
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

        <XStack ai="center" jc="center" gap="$1" pe="auto">
          <ToggleThemeButton />

          <YStack w={50} />
        </XStack>
      </XStack>
    </>
  )
}
