import { useEffect } from 'react'
import { Slot } from 'one'
import { ScrollView } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import { setCodeMode } from '~/features/docs/docsCodeMode'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function TailwindDocsLayout() {
  // set tailwind mode when entering this route group
  useEffect(() => {
    setCodeMode('tailwind')
    return () => {
      setCodeMode('styled')
    }
  }, [])

  return (
    <>
      <ThemeNameEffect colorKey="color1" />
      <YStack
        position="absolute"
        inset={0}
        maxH={1000}
        z={0}
        backgroundImage="linear-gradient(color3, color-transparent)"
      />

      <YStack minH="100vh" position="relative" z={1}>
        <XStack mx="auto" maxW={1400} width="100%">
          <View
            className="is-sticky"
            display="none gtMd:flex"
            position="gtMd:sticky"
            t="gtMd:20px"
            height="gtMd:calc(100vh - 20px)"
            width="gtMd:245px"
            shrink="gtMd:0px"
            alignSelf="gtMd:flex-start"
            x="gtMd:20px"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack pt={55} pb="18" px="2">
                <DocsMenuContents />
              </YStack>
            </ScrollView>
          </View>

          <Slot />
        </XStack>
      </YStack>

      <Footer />
    </>
  )
}
