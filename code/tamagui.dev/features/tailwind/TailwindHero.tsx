import { ScrollView } from 'react-native'
import type { Href } from 'one'
import { Paragraph, SizableText, Text, XStack, YStack } from 'tamagui'
import { ButtonLink } from '~/components/Link'
import { ContainerLarge } from '~/components/Containers'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

// a single restrained code line: <View className="..." />, lightly two-toned.
// scrolls horizontally on narrow screens instead of clipping the long className.
function HeroCode() {
  return (
    <YStack
      self="center"
      maxW="100%"
      rounded="$6"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$color1"
      overflow="hidden"
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SizableText
          fontFamily="$mono"
          size="$4"
          whiteSpace="pre"
          lineHeight="$6"
          px="$5"
          py="$4"
        >
          <Text color="$color9">{'<'}</Text>
          <Text color="$color11">View</Text>
          <Text color="$blue10"> className</Text>
          <Text color="$color9">=</Text>
          <Text color="$green10">
            "flex-row items-center gap-3 p-4 rounded-xl bg-indigo-500"
          </Text>
          <Text color="$color9">{' />'}</Text>
        </SizableText>
      </ScrollView>
    </YStack>
  )
}

export function TailwindHero() {
  return (
    <YStack position="relative">
      {/* restrained background wash */}
      <YStack
        position="absolute"
        inset={0}
        b="auto"
        height={620}
        z={-1}
        backgroundImage="linear-gradient($color3, $colorTransparent)"
        opacity={0.6}
      />

      <ContainerLarge pt="$13" pb="$8" gap="$6" items="center">
        <Paragraph
          fontFamily="$mono"
          size="$3"
          color="$accent7"
          letterSpacing={1}
          textTransform="uppercase"
        >
          Tamagui v3
        </Paragraph>

        <HomeH1 text="center" self="center" maxW={780}>
          Tailwind that runs on native
        </HomeH1>

        <Paragraph
          text="center"
          self="center"
          maxW={680}
          size="$6"
          lineHeight="$8"
          color="$color10"
        >
          Write Tailwind utility classes. The Tamagui compiler renders them on iOS and
          web, pixel-matched to Tailwind v4, in the same engine that gives you themes,
          tokens, and components.
        </Paragraph>

        <HeroCode />

        <XStack gap="$3" items="center" flexWrap="wrap" justify="center" pt="$2">
          <ButtonLink
            href={'/tailwind/intro/introduction' as Href}
            theme="accent"
            size="$5"
            fontFamily="$mono"
          >
            Read the docs
          </ButtonLink>
          <ButtonLink
            href={'/tailwind/intro/styles' as Href}
            chromeless
            size="$5"
            fontFamily="$mono"
          >
            How it works
          </ButtonLink>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
