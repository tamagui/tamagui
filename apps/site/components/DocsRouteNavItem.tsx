import { NextLink } from 'components/NextLink'
import * as React from 'react'
import { SizableText, Spacer, XStack, YStack } from 'tamagui'

import { NavItemProps } from './DocsPage'
import { ExternalIcon } from './ExternalIcon'

export const DocsRouteNavItem = function DocsRouteNavItem({
  children,
  active,
  href,
  pending,
  ...props
}: NavItemProps) {
  const isExternal = href.startsWith('http')
  return (
    <NextLink legacyBehavior={false} prefetch={false} href={href}>
      <XStack
        className="docs-nav-item all ease-in ms150"
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        ai="center"
        jc="flex-end"
        px="$4"
        opacity={pending ? 0.25 : 1}
        pressStyle={{
          backgroundColor: '$background',
        }}
        pointerEvents={pending ? 'none' : ('inherit' as any)}
        pos="relative"
        $sm={{
          py: '$1',
        }}
      >
        <YStack
          className="sidebar-indicator"
          o={active ? 1 : 0}
          pos="absolute"
          t={0}
          b={0}
          r={0}
          br="$2"
          w={3}
          bc={active ? '$color' : '$backgroundHover'}
        />
        <SizableText
          size="$4"
          lh="$3"
          cursor="pointer"
          userSelect="none"
          opacity={active ? 1 : 0.65}
          ta="right"
          w="100%"
          hoverStyle={{
            o: 0.85,
          }}
          {...(active && {
            fow: '700',
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
            <SizableText
              theme="alt2"
              size="$1"
              px="$2"
              py="$1"
              bc="$background"
              borderRadius="$3"
            >
              WIP
            </SizableText>
          </>
        ) : null}
      </XStack>
    </NextLink>
  )
}
