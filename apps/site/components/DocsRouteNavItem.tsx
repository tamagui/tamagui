import { NextLink } from 'components/NextLink'
import { useRef } from 'react'
import { SizableText, Spacer, XStack, YStack } from 'tamagui'
import { useStore, useStoreSelector, getStore } from '@tamagui/use-store'

import { NavItemProps } from './DocsPage'
import { ExternalIcon } from './ExternalIcon'

export class DocsItemsStore {
  index = 0
}

export const DocsRouteNavItem = function DocsRouteNavItem({
  children,
  active,
  href,
  pending,
  inMenu,
  index,
  ...props
}: NavItemProps & {
  inMenu?: boolean
  index: number
}) {
  const isActive = useStoreSelector(DocsItemsStore, (x) => x.index === index)
  const isExternal = href.startsWith('http')
  const ref = useRef<any>()

  return (
    <NextLink legacyBehavior={false} prefetch={false} href={href}>
      <XStack
        ref={ref}
        className="docs-nav-item all ease-in ms150"
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        ai="center"
        jc="flex-end"
        px="$4"
        py="$1"
        opacity={pending ? 0.25 : 1}
        pressStyle={{
          backgroundColor: '$background',
        }}
        pointerEvents={pending ? 'none' : ('inherit' as any)}
        pos="relative"
        onMouseEnter={() => {
          getStore(DocsItemsStore).index = index
        }}
        $sm={{
          py: '$1.5',
        }}
        {...(isActive && {
          bc: '$color3',
        })}
        {...(inMenu && {
          jc: 'flex-start',
        })}
      >
        {!inMenu && (
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
        )}
        <SizableText
          size="$4"
          lh="$3"
          cursor="pointer"
          userSelect="none"
          opacity={active ? 1 : 0.65}
          ta={inMenu ? 'left' : 'right'}
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
