import type { Href } from 'one'
import { createElement, useRef } from 'react'
import { SizableText, Spacer, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'
import { ExternalIcon } from '~/features/icons/ExternalIcon'
import type { NavItemProps } from './DocsPage'

export const DocsRouteNavItem = function DocsRouteNavItem({
  children,
  active,
  href,
  icon,
  pending,
  inMenu,
  external,
}: NavItemProps & {
  icon?: any
  inMenu?: boolean
}) {
  const isExternal = external || href.startsWith('http')
  const ref = useRef<any>(null)

  return (
    <Link
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      href={href as Href}
      outlineColor="focus-visible:outline-color"
      outlineWidth="focus-visible:2px"
      outlineStyle="focus-visible:solid"
      outlineOffset="focus-visible:-2px"
    >
      <XStack
        ref={ref}
        className="docs-nav-item"
        items="center"
        justify="flex-start"
        px="4"
        py="2 sm:2"
        opacity={pending ? 0.25 : 1}
        bg="hover:background06 press:background04"
        pointerEvents={pending ? 'none' : ('inherit' as any)}
        position="relative"
      >
        {!inMenu && (
          <YStack
            className="sidebar-indicator"
            opacity={active ? 1 : 0}
            position="absolute"
            t={0}
            b={0}
            l={0}
            rounded="2"
            width={3}
            bg={`${active ? 'color' : 'background-hover'}`}
          />
        )}
        <SizableText
          fontFamily="mono"
          letterSpacing={-0.5}
          lineHeight="4"
          cursor="pointer"
          select="none"
          opacity={`${active ? 1 : 0.65} hover:0.85`}
          width="100%"
          {...(active && {
            fontWeight: '700',
            opacity: 1,
          })}
          size="5"
          style={{ textAlign: 'left' }}
        >
          {children}
          {!!icon && (
            <>
              &nbsp;
              {createElement(icon, {
                size: 12,
              })}
            </>
          )}
        </SizableText>
        {isExternal && (
          <XStack opacity={0.5}>
            <Spacer size="2" />
            <ExternalIcon />
          </XStack>
        )}
        {pending ? (
          <>
            <XStack flex={1} />
            <SizableText
              color="color9"
              px="2"
              py="1"
              bg="background"
              rounded="3"
              size="1"
            >
              WIP
            </SizableText>
          </>
        ) : null}
      </XStack>
    </Link>
  )
}
