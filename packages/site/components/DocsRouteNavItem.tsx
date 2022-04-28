import NextLink from 'next/link'
import * as React from 'react'
import { Paragraph, SizableText, Spacer, XStack } from 'tamagui'

import { NavItemProps } from './DocsPage'
import { ExternalIcon } from './ExternalIcon'

export function DocsRouteNavItem({ children, active, href, pending, ...props }: NavItemProps) {
  const isExternal = href.startsWith('http')

  return (
    <NextLink href={href} passHref>
      <XStack
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        tag="a"
        ai="center"
        py="$1"
        px="$4"
        opacity={pending ? 0.25 : 0.75}
        hoverStyle={{
          backgroundColor: '$backgroundHover',
          opacity: 1,
        }}
        pressStyle={{
          backgroundColor: '$backgroundPress',
          opacity: 1,
        }}
        pointerEvents={pending ? 'none' : 'auto'}
        {...(active && {
          theme: 'alt3',
          backgroundColor: '$background',
          hoverStyle: {
            backgroundColor: '$background',
          },
        })}
      >
        <SizableText
          size="$3"
          userSelect="none"
          {...(active && {
            theme: 'alt2',
          })}
        >
          {children}
        </SizableText>
        {isExternal && (
          <>
            <Spacer size="$1" />
            <ExternalIcon />
          </>
        )}
        {!!pending ? (
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
