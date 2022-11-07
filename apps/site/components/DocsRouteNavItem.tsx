import NextLink from 'next/link'
import * as React from 'react'
import { SizableText, Spacer, XStack, YStack } from 'tamagui'

import { NavItemProps } from './DocsPage'
import { ExternalIcon } from './ExternalIcon'

export function DocsRouteNavItem({ children, active, href, pending, ...props }: NavItemProps) {
  const isExternal = href.startsWith('http')
  return (
    <NextLink legacyBehavior href={href} passHref>
      <XStack
        className="docs-nav-item all ease-in ms150"
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        tag="a"
        ai="center"
        jc="flex-end"
        py="$0.5"
        px="$4"
        opacity={pending ? 0.25 : 1}
        pressStyle={{
          backgroundColor: '$background',
        }}
        pointerEvents={pending ? 'none' : 'auto'}
        pos="relative"
        $sm={{
          py: '$1.5',
        }}
      >
        <YStack
          className="sidebar-indicator"
          o={active ? 1 : 0}
          pos="absolute"
          t={0}
          b={0}
          r={0}
          w={1}
          bc={active ? '$color' : '$backgroundHover'}
        />
        <SizableText
          className="name"
          size="$4"
          userSelect="none"
          opacity={0.65}
          {...(active && {
            theme: 'alt2',
            fow: '900',
            opacity: 1,
          })}
        >
          {children}
        </SizableText>
        {isExternal && (
          <XStack opacity={0.5}>
            <Spacer size="$2" />
            <ExternalIcon />
          </XStack>
        )}
        {pending ? (
          <>
            <XStack flex={1} />
            <SizableText theme="alt2" size="$1" px="$2" py="$1" bc="$background" borderRadius="$3">
              WIP
            </SizableText>
          </>
        ) : null}
      </XStack>
    </NextLink>
  )
}
