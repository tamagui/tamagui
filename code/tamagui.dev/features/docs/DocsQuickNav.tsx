import { href, usePathname, type Href } from 'one'
import { useEffect, useState } from 'react'
import {
  H4,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Theme,
  View,
  XStack,
  YStack,
} from '@tamagui/ui'

import { Link, type LinkProps } from '~/components/Link'
import { BentoButton } from '../site/BentoButton'
import { TakeoutButton } from '../site/TakeoutButton'

interface QuickNavLinkProps extends LinkProps {
  level: number
  showSeparator?: boolean
}

const QuickNavLink = ({ href, level, showSeparator, ...rest }: QuickNavLinkProps) => {
  const indentLevel = Math.max(0, level - 2) // H2 = 0, H3 = 1, H4 = 2, etc.
  const isSubItem = level > 2

  return (
    <YStack>
      <XStack ai="center" pl={indentLevel * 16} gap="$2">
        {/* {isSubItem && <Circle size={4} bg="$color8" flexShrink={0} />} */}
        <a
          onClick={(e) => e.stopPropagation()}
          href={href as any}
          style={{ textDecoration: 'none' }}
        >
          <Paragraph
            tag="span"
            size={level === 2 ? '$3' : '$2'}
            color={level === 2 ? '$color11' : '$color10'}
            cursor="pointer"
            py="$1"
            fontWeight={level === 2 ? '500' : '400'}
            hoverStyle={{ color: '$color12' }}
            {...(rest as any)}
          />
        </a>
      </XStack>

      {showSeparator && isSubItem && (
        <View h={1} bg="$borderColor" o={0.6} mx="$2" my="$2" />
      )}
    </YStack>
  )
}

export function DocsQuickNav() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const headingElements: HTMLHeadingElement[] = Array.from(
      document.querySelectorAll('[data-heading]')
    )
    setHeadings(headingElements)
  }, [pathname])

  // Function to determine the Heading Level based on `nodeName` (H2, H3, etc)
  const getLevel = (nodeName: string): number => {
    return Number(nodeName.replace('H', ''))
  }

  return (
    <YStack
      tag="aside"
      display="none"
      $gtLg={{
        display: 'flex',
        width: 280,
        flexShrink: 0,
        zIndex: 1,
        position: 'fixed' as any,
        left: '50%',
        top: 140,
        marginLeft: 450,
      }}
    >
      <YStack gap="$5">
        <XStack ai="center" gap="$5">
          <Link
            href={href(`${process.env.ONE_SERVER_URL}${pathname}.md` as any)}
            target="_blank"
          >
            <SizableText size="$3" ff="$mono">
              .md
            </SizableText>
          </Link>

          <Separator minHeight={20} vertical />

          <Link
            target="_blank"
            href={href(`${process.env.ONE_SERVER_URL}/llms.txt` as any)}
          >
            <SizableText size="$3" ff="$mono">
              llms.txt
            </SizableText>
          </Link>
        </XStack>

        <Separator />

        <YStack
          tag="nav"
          aria-labelledby="site-quick-nav-heading"
          mb="$10"
          mt="$2"
          display={headings.length === 0 ? 'none' : 'flex'}
          gap="$2"
        >
          <H4 ff="$mono" size="$5" mb="$2" theme="alt1" id="site-quick-nav-heading">
            Contents
          </H4>

          <ScrollView maxHeight="calc(100vh - var(--space-25))">
            <YStack py="$2" gap="$1">
              {headings.map(({ id, nodeName, innerText }, index) => {
                const level = getLevel(nodeName)
                const nextLevel =
                  index < headings.length - 1 ? getLevel(headings[index + 1].nodeName) : 0
                const showSeparator = level > 2 && nextLevel > 0 && nextLevel <= level

                return (
                  <QuickNavLink
                    key={`${id}-${index}`}
                    href={`#${id}` as Href}
                    level={level}
                    showSeparator={showSeparator}
                  >
                    {innerText}
                  </QuickNavLink>
                )
              })}
            </YStack>
          </ScrollView>
        </YStack>

        <YStack gap="$2">
          <Theme name="tan">
            <Link width="100%" href="/bento">
              <BentoButton bg="transparent" />
            </Link>
          </Theme>
          <Theme name="gray">
            <Link width="100%" href="/takeout">
              <TakeoutButton bg="transparent" />
            </Link>
          </Theme>
        </YStack>
      </YStack>
    </YStack>
  )
}
