import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Paragraph, TooltipSimple, YStack, styled } from 'tamagui'

import { GithubIcon } from './GithubIcon'
import { HeaderProps } from './HeaderProps'
import { NextLink } from './NextLink'

const HeadAnchor = styled(Paragraph, {
  fontFamily: '$silkscreen',
  px: '$3',
  py: '$2',
  cursor: 'pointer',
  size: '$3',
  color: '$color10',
  hoverStyle: { opacity: 1, color: '$color' },
  pressStyle: { opacity: 0.25 },
  tabIndex: -1,
  tag: 'a',
})

export const HeaderLinks = ({ showExtra, forceShowAllLinks, isHeader }: HeaderProps) => {
  const userSwr = useUser()
  const router = useRouter()
  // there is user context and supabase setup in the current page
  return (
    <>
      <NextLink passHref prefetch={false} href="/docs/intro/installation">
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      {/* <NextLink passHref prefetch={false} href="/themes">
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Themes
        </HeadAnchor>
      </NextLink> */}

      <NextLink passHref prefetch={false} href="/studio">
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Studio
        </HeadAnchor>
      </NextLink>

      {!router.asPath.startsWith('/takeout') && (
        <NextLink legacyBehavior={false} prefetch={false} href="/takeout">
          <TooltipSimple disabled={forceShowAllLinks} label="Takeout Starter Kit">
            <HeadAnchor
              tag="span"
              size={forceShowAllLinks ? '$4' : '$8'}
              $sm={{
                display: forceShowAllLinks ? 'flex' : 'none',
              }}
            >
              {forceShowAllLinks ? `Takeout 🥡` : `🥡`}
            </HeadAnchor>
          </TooltipSimple>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink
          prefetch={false}
          legacyBehavior={true}
          passHref
          target="_blank"
          href="https://github.com/tamagui/tamagui"
        >
          <HeadAnchor tag="span">
            Github{' '}
            <YStack dsp={'inline-block' as any} y={10} my={-20} o={0.8}>
              <GithubIcon width={16} />
            </YStack>
          </HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink passHref prefetch={false} href="/community">
          <HeadAnchor>Community</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink passHref prefetch={false} href="/studio">
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink passHref prefetch={false} href="/blog">
          <HeadAnchor>Blog</HeadAnchor>
        </NextLink>
      )}

      {!userSwr.data?.session?.user && !isHeader && (
        <NextLink passHref prefetch={false} href="/login">
          <HeadAnchor
            $md={{
              display: forceShowAllLinks ? 'flex' : 'none',
            }}
          >
            Login
          </HeadAnchor>
        </NextLink>
      )}
    </>
  )
}
