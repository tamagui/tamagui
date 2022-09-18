import { docsRoutes } from '@lib/docsRoutes'
import * as React from 'react'
import { ScrollView } from 'react-native'
import { EnsureFlexed, Paragraph, Separator, Spacer, XStack, YStack, useMedia } from 'tamagui'

import { DocsRouteNavItem } from './DocsRouteNavItem'
import { NavHeading } from './NavHeading'
import { useDocsMenu } from './useDocsMenu'

export const DocsMenuContents = () => {
  const { currentPath } = useDocsMenu()

  return (
    <>
      {docsRoutes.map((section, i) => {
        if ('type' in section) {
          if (section.type === 'hr') {
            return (
              <YStack key={`sep-${i}`} mx="$4">
                {!!section.title ? (
                  <XStack ai="center" space="$6" spaceDirection="horizontal" mb="$2" mt="$3">
                    <Separator />
                    <Paragraph size="$4">{section.title}</Paragraph>
                  </XStack>
                ) : (
                  <Separator my="$4" />
                )}
              </YStack>
            )
          }
          return null
        }
        return (
          <YStack key={`${section.label}${i}`} mb="$4">
            {!!section.label && <NavHeading>{section.label}</NavHeading>}
            {section.pages.map((page) => {
              return (
                <DocsRouteNavItem
                  key={`${page.route}`}
                  href={page.route}
                  active={currentPath === page.route}
                  pending={page['pending']}
                >
                  {page.title}
                </DocsRouteNavItem>
              )
            })}
          </YStack>
        )
      })}
    </>
  )
}
