import { classNames } from '@tamagui/remove-scroll'
import { useEffect, useState } from 'react'
import { Circle, H4, Paragraph, Separator, XStack, YStack } from 'tamagui'
import type { LinkProps } from 'one'
import { ScrollView } from '../site/ScrollView'
import { Frontmatter } from '@tamagui/mdx'

const QuickNavLink = ({ href, ...rest }: LinkProps) => (
  <a onClick={(e) => [e.stopPropagation()]} href={href as any}>
    <Paragraph
      tag="span"
      size="$3"
      color="$color11"
      cursor="pointer"
      py="$0.5"
      hoverStyle={{
        color: '$color12',
      }}
      {...rest}
    />
  </a>
)

export function DocsRightSidebar({
  headings = [],
}: { headings: Frontmatter['headings'] }) {
  return (
    <YStack
      tag="aside"
      className={classNames.zeroRight}
      display="none"
      $gtLg={{
        display: 'flex',
        pe: 'none',
        width: 200,
        flexShrink: 0,
        zIndex: 1,
        position: 'fixed' as any,
        left: '50%',
        top: 100,
        marginLeft: 500,
      }}
    >
      <YStack
        tag="nav"
        aria-labelledby="site-quick-nav-heading"
        display={headings.length === 0 ? 'none' : 'flex'}
        gap="$2"
        pe="auto"
      >
        <H4 size="$2" mx="$2" id="site-quick-nav-heading">
          Quick nav
        </H4>

        <Separator />

        <YStack maxHeight="calc(100vh - var(--space-25))">
          <ScrollView>
            <YStack px="$2">
              <ul style={{ margin: 0, padding: 0 }}>
                {headings.map(({ id, title, priority }, i) => {
                  return (
                    <XStack key={i} tag="li" ai="center" py="$2">
                      {priority > 2 && <Circle size={4} mx="$2" />}
                      <QuickNavLink href={id}>{title}</QuickNavLink>
                    </XStack>
                  )
                })}
              </ul>
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </YStack>
  )
}
