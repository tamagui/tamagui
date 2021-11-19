import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { RemoveScroll } from 'react-remove-scroll'
import { H4, Spacer, YStack } from 'tamagui'

import { Link, LinkProps } from './Link'

const QuickNavLink = (props: LinkProps) => (
  <Link
    size="$2"
    fontSize="$2"
    opacity={0.5}
    color="$color"
    py={3}
    hoverStyle={{
      opacity: 1,
    }}
    {...props}
  />
)

export function QuickNav() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([])

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
      className={RemoveScroll.classNames.zeroRight}
      display="none"
      $lg={{
        display: 'flex',
        width: 230,
        flexShrink: 0,
        zIndex: 1,
        position: 'fixed',
        right: 0,
        top: 90,
      }}
    >
      <ScrollView>
        <YStack
          tag="nav"
          aria-labelledby="site-quick-nav-heading"
          px="$5"
          display={headings.length === 0 ? 'none' : 'block'}
        >
          <H4 size="$3" mb="$4" id="site-quick-nav-heading">
            Quick nav
          </H4>

          <ul style={{ paddingTop: 10, margin: 0, padding: 0 }}>
            {/* loading ... {headings.length === 0 && (
              <YStack tag="li">
                <QuickNavLink>
                  <YStack />
                </QuickNavLink>
              </YStack>
            )} */}

            {headings.map(({ id, nodeName, innerText }) => {
              return (
                <YStack tag="li" key={id} data-level={getLevel(nodeName)}>
                  <QuickNavLink href={`#${id}`}>{innerText}</QuickNavLink>
                </YStack>
              )
            })}
          </ul>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
