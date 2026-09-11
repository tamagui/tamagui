import type { ReactNode } from 'react'
import { ScrollView } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import { DocsMenuContents } from './DocsMenuContents'
import { Footer } from '../site/Footer'

export function DocsSyntaxLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <YStack minH="100vh" position="relative" z={1}>
        <XStack mx="auto" maxW={1440} width="100%">
          <View
            className="is-sticky"
            display="none gtMd:flex"
            position="gtMd:sticky"
            t="gtMd:20px"
            height="gtMd:calc(100vh - 20px)"
            width="gtMd:220px"
            shrink="gtMd:0px"
            alignSelf="gtMd:flex-start"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack pt={36} pb="18" px="2" gap="4">
                <View id="docs-version-picker-slot" px="2" />
                <DocsMenuContents />
              </YStack>
            </ScrollView>
          </View>

          {children}
        </XStack>
      </YStack>

      <Footer />
    </>
  )
}
