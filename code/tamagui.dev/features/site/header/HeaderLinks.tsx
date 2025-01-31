import { ExternalLink, Figma, LogIn, Paintbrush } from '@tamagui/lucide-icons'
import * as React from 'react'
import { H2, Paragraph, Separator, SizableText, XStack, YStack, styled } from 'tamagui'
import { Link } from '~/components/Link'
import { BentoIcon } from '~/features/icons/BentoIcon'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { TakeoutIcon } from '~/features/icons/TakeoutIcon'
import { useUser } from '~/features/user/useUser'
import { UserAvatar } from './UserAvatar'
import type { HeaderProps } from './types'

export const HeadAnchor = styled(Paragraph, {
  tag: 'a',
  fontFamily: '$silkscreen',
  px: '$3',
  py: '$3',
  cursor: 'pointer',
  fontSize: 14,
  color: '$color11',
  tabIndex: -1,

  hoverStyle: {
    color: '$color',
    br: '$3',
  },

  pressStyle: {
    opacity: 0.25,
  },

  variants: {
    grid: {
      true: {
        fow: '200',
        ls: 1,
        textTransform: 'unset',
        w: '100%',
        f: 1,
        p: '$2',
        px: '$4',

        hoverStyle: {
          backgroundColor:
            'color-mix(in srgb, var(--color8) 10%, transparent 50%)' as any,
        },
      },
    },

    half: {
      true: {
        maxWidth: '48.5%',
        overflow: 'hidden',
      },
    },
  } as const,
})

export const HeaderLinks = (props: HeaderProps) => {
  const { showExtra, forceShowAllLinks, isHeader } = props
  const userSwr = useUser()
  // there is user context and supabase setup in the current page

  const primaryLinks = (
    <>
      {forceShowAllLinks ? (
        <>
          <Link asChild href="/docs/intro/introduction">
            <HeadAnchor
              // half={forceShowAllLinks}
              grid={forceShowAllLinks}
              $sm={{
                display: forceShowAllLinks ? 'flex' : 'none',
              }}
            >
              Core
            </HeadAnchor>
          </Link>

          <Link asChild href="/docs/intro/compiler-install">
            <HeadAnchor
              // half={forceShowAllLinks}
              grid={forceShowAllLinks}
              $sm={{
                display: forceShowAllLinks ? 'flex' : 'none',
              }}
            >
              Compile
            </HeadAnchor>
          </Link>
        </>
      ) : null}

      {!forceShowAllLinks && (
        <>
          <Link asChild href="/docs/intro/introduction">
            <HeadAnchor
              $sm={{
                display: 'none',
              }}
            >
              Core
            </HeadAnchor>
          </Link>

          <Link asChild href="/docs/intro/compiler-install">
            <HeadAnchor
              $sm={{
                display: 'none',
              }}
            >
              Compiler
            </HeadAnchor>
          </Link>
        </>
      )}

      <Link asChild href="/ui/intro">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          UI
        </HeadAnchor>
      </Link>

      <Link asChild href="/theme">
        <HeadAnchor
          // half={forceShowAllLinks}
          grid={forceShowAllLinks}
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Theme
        </HeadAnchor>
      </Link>
    </>
  )

  return (
    <>
      {forceShowAllLinks ? (
        <>
          {primaryLinks}
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      ) : (
        primaryLinks
      )}
      {/* {forceShowAllLinks ? (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            {primaryLinks}
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      ) : (
        primaryLinks
      )} */}

      {forceShowAllLinks && (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            <Link asChild href="/takeout">
              <HeadAnchor grid half tag="a">
                <XStack ai="center">
                  Takeout{' '}
                  <YStack dsp={'inline-block' as any} x={6} my={-20} o={0.8}>
                    <TakeoutIcon scale={0.65} />
                  </YStack>
                </XStack>
                <SizableText size="$2" theme="alt2">
                  Starter Kit
                </SizableText>
              </HeadAnchor>
            </Link>

            <Link asChild href="/bento">
              <HeadAnchor grid half tag="a">
                <XStack ai="center">
                  Bento{' '}
                  <YStack
                    ml={3}
                    dsp={'inline-block' as any}
                    x={6}
                    y={-1}
                    my={-10}
                    o={0.8}
                  >
                    <BentoIcon scale={0.65} />
                  </YStack>
                </XStack>
                <SizableText size="$2" theme="alt2">
                  Copy-paste UI
                </SizableText>
              </HeadAnchor>
            </Link>
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      )}

      {forceShowAllLinks && (
        <>
          <XStack fw="wrap" f={1} gap="$2" w="100%">
            <Link asChild href="/community">
              <HeadAnchor grid tag="a">
                Community
              </HeadAnchor>
            </Link>
            {/* <Link asChild href="/studio">
              <HeadAnchor
                grid
                half
                tag="a"
                $md={{
                  display: forceShowAllLinks ? 'flex' : 'none',
                }}
              >
                Studio
              </HeadAnchor>
            </Link> */}
          </XStack>
          <Separator bc="$color02" o={0.25} my="$2" />
        </>
      )}

      {showExtra && (
        <Link asChild href="/studio">
          <HeadAnchor grid={forceShowAllLinks}>Studio</HeadAnchor>
        </Link>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color02" o={0.25} my="$2" />
          {!userSwr.data?.userDetails && (
            <Link asChild href="/login">
              <HeadAnchor grid>
                Login
                <YStack dsp={'inline-block' as any} y={2} x={10} als="flex-end">
                  <LogIn color="$color10" size={14} />
                </YStack>
              </HeadAnchor>
            </Link>
          )}
          {userSwr.data?.userDetails && (
            <Link asChild href="/login">
              <HeadAnchor grid>
                <XStack ai="center" jc="center">
                  Account
                  <YStack flex={10} />
                  <YStack dsp={'inline-block' as any} y={-2} my={-3} als="flex-end">
                    <UserAvatar size={22} />
                  </YStack>
                </XStack>
              </HeadAnchor>
            </Link>
          )}
        </>
      )}

      {forceShowAllLinks && (
        <>
          <Separator bc="$color02" o={0.25} my="$2" />

          <XStack fw="wrap" f={1} gap="$2" w="100%">
            <Link asChild href="https://github.com/tamagui/tamagui">
              <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                Github{' '}
                <YStack dsp={'inline-block' as any} y={10} my={-20} o={0.8}>
                  <GithubIcon width={14} />
                </YStack>
              </HeadAnchor>
            </Link>

            <Link
              asChild
              href="https://www.figma.com/community/file/1326593766534421119/tamagui-v1-2-1"
            >
              <HeadAnchor target="_blank" half grid={forceShowAllLinks}>
                Figma{' '}
                <YStack dsp={'inline-block' as any} y={2} my={-20} o={0.8}>
                  <Figma size={14} />
                </YStack>
              </HeadAnchor>
            </Link>

            <Link asChild href="/blog">
              <HeadAnchor half grid={forceShowAllLinks}>
                Blog
              </HeadAnchor>
            </Link>

            <Link asChild href="https://github.com/sponsors/natew">
              <HeadAnchor half target="_blank" grid={forceShowAllLinks}>
                Sponsor
                <YStack dsp={'inline-block' as any} y={0} my={-20} ml={12} o={0.8}>
                  <ExternalLink size={10} o={0.5} />
                </YStack>
              </HeadAnchor>
            </Link>
          </XStack>
        </>
      )}
    </>
  )
}
