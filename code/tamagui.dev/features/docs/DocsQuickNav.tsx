import { classNames } from '@tamagui/remove-scroll'
import { href, usePathname, type Href } from 'one'
import { useEffect, useState } from 'react'
import {
  Button,
  Circle,
  H4,
  Label,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Theme,
  XGroup,
  XStack,
  YStack,
} from 'tamagui'

import { ButtonLink, Link, type LinkProps } from '~/components/Link'
import { BentoButton } from '../site/BentoButton'
import { TakeoutButton } from '../site/TakeoutButton'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'

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
      {...(rest as any)}
    />
  </a>
)

export function DocsQuickNav() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const headingElements: HTMLHeadingElement[] = Array.from(
      document.querySelectorAll('[data-heading]')
    )
    setHeadings(headingElements)
  }, [])

  // Function to determine the Heading Level based on `nodeName` (H2, H3, etc)
  const getLevel = (nodeName) => {
    return Number(nodeName.replace('H', ''))
  }

  return (
    <YStack
      tag="aside"
      // Components that hide the scrollbar (like Dialog) add padding to
      // account for the scrollbar gap to avoid layout jank. This does not
      // work for position: fixed elements. Since we use react-remove-scroll
      // under the hood for those primitives, we can add this helper class
      // provided by that lib to deal with that for the QuickNav.
      // https://github.com/radix-ui/website/issues/64
      // https://github.com/theKashey/react-remove-scroll#positionfixed-elements
      className={classNames.zeroRight}
      display="none"
      $gtLg={{
        display: 'flex',
        width: 280,
        flexShrink: 0,
        zIndex: 1,
        position: 'fixed' as any,
        left: '50%',
        top: 130,
        marginLeft: 450,
      }}
    >
      <YStack
        tag="nav"
        aria-labelledby="site-quick-nav-heading"
        px="$5"
        display={headings.length === 0 ? 'none' : 'flex'}
        gap="$2"
      >
        <H4 size="$2" mx="$2" theme="alt1" id="site-quick-nav-heading">
          Contents
        </H4>
        <Separator />

        <ScrollView maxHeight="calc(100vh - var(--space-25))">
          <YStack px="$2" py="$2">
            <ul style={{ margin: 0, padding: 0 }}>
              {headings.map(({ id, nodeName, innerText }, i) => {
                const level = getLevel(nodeName)
                return (
                  <XStack key={i} tag="li" ai="center">
                    {level > 2 && <Circle size={4} mx="$2" />}
                    <QuickNavLink href={`#${id}` as Href}>{innerText}</QuickNavLink>
                  </XStack>
                )
              })}
            </ul>
          </YStack>
        </ScrollView>
      </YStack>

      <YStack gap="$5" my="$6">
        <XStack ai="center" gap="$3">
          <XGroup borderRadius="$8">
            <Label ff="$mono" px="$3" size="$3" bg="$color3">
              Format:
            </Label>

            <ButtonLink
              fontFamily="$mono"
              href={href(`${process.env.ONE_SERVER_URL}${pathname}.md` as any)}
              size="$3"
              target="_blank"
            >
              .md
            </ButtonLink>
          </XGroup>

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

        <YStack gap="$2">
          <Theme name="tan">
            <Link width="100%" href="/bento">
              <BentoButton />
            </Link>
          </Theme>
          <Theme name="gray">
            <Link width="100%" href="/takeout">
              <TakeoutButton />
            </Link>
          </Theme>
        </YStack>
      </YStack>
    </YStack>
  )
}
