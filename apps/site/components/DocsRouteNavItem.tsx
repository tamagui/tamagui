import { useItemList } from 'use-item-list'
import { NextLink } from 'components/NextLink'
import { SizableText, Spacer, XStack, YStack } from 'tamagui'
import { createContext, useContext, useEffect, useRef } from 'react'

import { NavItemProps } from './DocsPage'
import { ExternalIcon } from './ExternalIcon'
import { useRouter } from 'next/router'

export const DocsItemContext = createContext<ReturnType<typeof useItemList> | null>(null)

export const DocsRouteNavItem = function DocsRouteNavItem({
  children,
  active,
  href,
  pending,
  inMenu,
  ...props
}: NavItemProps & {
  inMenu?: boolean
}) {
  const router = useRouter()
  const isExternal = href.startsWith('http')
  const { useItem, clearHighlightedItem } = useContext(DocsItemContext)!
  const ref = useRef<any>()
  const { id, highlight, useHighlighted, selected } = useItem({
    ref,
    value: children,
  })
  const highlighted = useHighlighted()

  useEffect(() => {
    if (selected && router.asPath !== href) {
      console.info(`keyboard nav`, href)
      router.push(href)
    }
  }, [selected])

  return (
    <NextLink legacyBehavior={false} prefetch={false} href={href}>
      <XStack
        id={id}
        ref={ref}
        onMouseEnter={() => {
          highlight()
        }}
        onMouseLeave={() => {
          clearHighlightedItem()
        }}
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
        {...(highlighted && {
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
