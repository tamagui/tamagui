import { LinearGradient } from '@tamagui/linear-gradient'
import { Slot } from 'one'
import { ScrollView } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function DocsLayout() {
  const { section } = useDocsMenu()

  const themeName =
    section === 'core' || section === 'compiler'
      ? 'red'
      : section === 'ui'
        ? 'blue'
        : null

  return (
    <ThemeNameEffect theme={themeName} colorKey="$color1">
      <LinearGradient
        position="absolute"
        t={0}
        r={0}
        l={0}
        height="100%"
        maxH={1000}
        z={0}
        colors={['$color1', '$accent12']}
      />

      <YStack z={-1} fullscreen bg="$accent12" />

      {/* main layout container */}
      <YStack minH="100vh" position="relative" z={1}>
        {/* content row with sidebar */}
        <XStack mx="auto" maxW={1400} width="100%">
          {/* left sidebar - sticky */}
          <View
            className="is-sticky"
            display="none"
            $gtMd={{
              display: 'flex',
              position: 'sticky',
              t: 20,
              height: 'calc(100vh - 20px)',
              width: 245,
              shrink: 0,
              alignSelf: 'flex-start',
              x: 20,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack pt={55} pb="$18" px="$2">
                <DocsMenuContents />
              </YStack>
            </ScrollView>
          </View>

          <Slot />
        </XStack>
      </YStack>

      {/* footer outside the main layout */}
      <Footer />
    </ThemeNameEffect>
  )
}
