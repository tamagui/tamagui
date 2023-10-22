import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Paragraph, TooltipSimple, styled } from 'tamagui'

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
  w: '100%',
  tag: 'a',
})

export const HeaderLinks = ({ showExtra, forceShowAllLinks, showAuth }: HeaderProps) => {
  const userSwr = useUser()
  const router = useRouter()
  // there is user context and supabase setup in the current page
  return (
    <>
      <NextLink prefetch={false} href="/docs/intro/installation">
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      <NextLink prefetch={false} href="/studio">
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Studio
        </HeadAnchor>
      </NextLink>

      {!router.asPath.startsWith('/takeout') && (
        <NextLink prefetch={false} href="/takeout">
          <TooltipSimple delay={0} restMs={25} label="Takeout">
            <HeadAnchor
              {...(!forceShowAllLinks && {
                size: '$8',
              })}
              $sm={{
                display: forceShowAllLinks ? 'flex' : 'none',
              }}
            >
              {forceShowAllLinks ? ' Takeout 🥡' : '🥡'}
            </HeadAnchor>
          </TooltipSimple>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink prefetch={false} href="/blog">
          <HeadAnchor>Blog</HeadAnchor>
        </NextLink>
      )}

      {forceShowAllLinks && (
        <NextLink prefetch={false} href="/community">
          <HeadAnchor>Community</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink prefetch={false} href="/studio">
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}

      {!userSwr.data?.session?.user && (forceShowAllLinks || showAuth) && (
        <NextLink prefetch={false} href="/login">
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
