import { Slot } from 'one'
import { ScrollView } from 'react-native'
import { View, XStack, YStack } from 'tamagui'
import { DocsMenuContents } from '~/features/docs/DocsMenuContents'
import { Footer } from '~/features/site/Footer'

export default function DocsLayout() {
  // disabled route-based tint changes
  // const themeName = useThemeName()

  return (
    <>
      <YStack
        position="absolute"
        inset={0}
        maxH={1000}
        z={0}
        backgroundImage="linear-gradient(color3, color-transparent)"
      />

      {/* main layout container */}
      <YStack minH="100vh" position="relative" z={1}>
        {/* content row with sidebar */}
        <XStack mx="auto" maxW={1400} width="100%">
          {/* left sidebar - sticky */}
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

      {/* footer outside the main layout */}
      <Footer />
    </>
  )
}
