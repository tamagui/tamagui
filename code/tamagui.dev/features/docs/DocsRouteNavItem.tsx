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
    >
      <XStack
        ref={ref}
        className="docs-nav-item"
        items="center"
        justify="flex-end"
        px="$4"
        py="$1.5"
        opacity={pending ? 0.25 : 1}
        pressStyle={{
          bg: '$background04',
        }}
        pointerEvents={pending ? 'none' : ('inherit' as any)}
        position="relative"
        $sm={{
          py: '$1.5',
        }}
        hoverStyle={{
          bg: 'color-mix(in srgb, var(--color8) 10%, transparent 50%)' as any,
        }}
        {...(inMenu && {
          jc: 'flex-start',
        })}
      >
        {!inMenu && (
          <YStack
            className="sidebar-indicator"
            opacity={active ? 1 : 0}
            position="absolute"
            t={0}
            b={0}
            r={0}
            rounded="$2"
            width={3}
            bg={active ? '$color' : '$backgroundHover'}
          />
        )}
        <SizableText
          fontFamily="$mono"
          size="$4"
          letterSpacing={-0.5}
          lineHeight="$3"
          cursor="pointer"
          select="none"
          opacity={active ? 1 : 0.65}
          text={inMenu ? 'left' : 'right'}
          width="100%"
          hoverStyle={{
            opacity: 0.85,
          }}
          {...(active && {
            fontWeight: '700',
            opacity: 1,
          })}
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
              bg="$background"
              rounded="$3"
            >
              WIP
            </SizableText>
          </>
        ) : null}
      </XStack>
    </Link>
  )
}
