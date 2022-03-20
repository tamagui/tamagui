import NextLink from 'next/link'
import * as React from 'react'
import { Paragraph, Spacer, XStack } from 'tamagui'

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
          backgroundColor: '$bgTransparent',
          opacity: 1,
        }}
        minHeight="$6"
        pointerEvents={pending ? 'none' : 'auto'}
        {...(active && {
          theme: 'alt3',
          backgroundColor: '$background',
          hoverStyle: {
            backgroundColor: '$background',
          },
        })}
      >
        <Paragraph
          size="$3"
          color="$color"
          userSelect="none"
          {...(active && {
            theme: 'alt2',
          })}
        >
          {children}
        </Paragraph>
        {isExternal && (
          <>
            <Spacer />
            <ExternalIcon />
          </>
        )}
        {!!pending ? (
          <>
            <XStack flex={1} />
            <Paragraph theme="alt2" size="$1" px="$2" py="$1" bc="$background" borderRadius="$3">
              WIP
            </Paragraph>
          </>
        ) : null}
      </XStack>
    </NextLink>
  )
}
