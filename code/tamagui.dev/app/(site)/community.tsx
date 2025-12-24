import { ChevronRight } from '@tamagui/lucide-icons'
import type { Href } from 'one'
import { ScrollView } from 'react-native'
import {
  Button,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  Paragraph,
  Spacer,
  XStack,
  YStack,
} from 'tamagui'
import { Card } from '~/components/Card'
import { ContainerLarge } from '~/components/Containers'
import { FlatBubbleCard } from '~/components/FlatBubbleCard'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { SponsorCarousel } from '~/components/SponsorCarousel'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { SocialLinksRow } from '~/features/site/home/SocialLinksRow'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Community() {
  return (
    <ThemeNameEffect>
      <HeadInfo title="Community" />

      <Spacer size="$4" />

      <ContainerLarge gap="$4">
        <Spacer />

        <H1 self="center">Community</H1>

        <Spacer />

        <SocialLinksRow />

        <Spacer />

        <XStack $sm={{ flexDirection: 'column' }}>
          <FlatBubbleCard
            width="50%"
            $sm={{ width: 'auto' }}
            items="center"
            borderWidth={0}
          >
            <Link href="/blog">
              <Button
                bg="transparent"
                borderColor="$borderColor"
                borderWidth={1}
                mt="$-3"
                size="$6"
                iconAfter={ChevronRight}
                rounded="$10"
              >
                <H2 cursor="pointer" size="$9" text="center">
                  The Blog
                </H2>
              </Button>
            </Link>
            <Spacer />
            {/* TODO */}
            {/* <YStack w="100%" space>
              {[].map((frontmatter) => (
                <Link key={frontmatter.title} href={frontmatter.slug}>
                  <Card bc="transparent" p="$4" f={1}>
                    <YStack gap="$2">
                      <H3
                        fontFamily="$silkscreen"
                        size="$6"
                        color="$color"
                        cursor="pointer"
                      >
                        {frontmatter.title}
                      </H3>

                      <XStack ai="center" space="$2">
                        <Paragraph
                          cursor="inherit"
                          tag="time"
                          size="$5"
                          theme="alt2"
                          fow="300"
                        >
                          {Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            year: 'numeric',
                            day: 'numeric',
                          }).format(new Date(frontmatter.publishedAt || ''))}
                        </Paragraph>
                        <Paragraph cursor="inherit" theme="alt2" size="$4" fow="300">
                          &nbsp;by {authors[frontmatter.by].name}
                        </Paragraph>
                      </XStack>
                    </YStack>
                  </Card>
                </Link>
              ))}
            </YStack> */}
          </FlatBubbleCard>

          <Spacer size="$4" />

          <FlatBubbleCard items="center" feature borderWidth={0}>
            <H2 size="$9" text="center">
              Figma Design Kit
            </H2>
            <Spacer size="$6" />
            <YStack items="center" gap="$4">
              <Link href="https://www.figma.com/community/file/1326593766534421119">
                <YStack
                  target="_blank"
                  rel="noopener noreferrer"
                  rounded="$5"
                  overflow="hidden"
                  borderWidth={0.5}
                  borderColor="$borderColor"
                >
                  <Image
                    animation="quick"
                    cursor="pointer"
                    shadowColor="$shadowColor"
                    shadowRadius="$4"
                    hoverStyle={{
                      scale: 1.2,
                      borderColor: '$color',
                    }}
                    opacity={0.5}
                    source={{
                      uri: '/figma.png',
                      width: 1466 * 0.25,
                      height: 776 * 0.25,
                    }}
                  />
                </YStack>
              </Link>
            </YStack>
          </FlatBubbleCard>
        </XStack>

        <Spacer />

        <FlatBubbleCard borderWidth={0.5} gap="$4">
          <H3 id="starter-repos" text="center">
            Starter repos & Guides
          </H3>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack py="$2" gap="$4">
              <StarterRepoCard
                url="https://galaxies.dev/course/react-native-tamagui  "
                name="Universal Apps with Tamagui (Guide)"
                author="Simon Grimm"
              />

              <StarterRepoCard
                url="https://github.com/srikanthkh/tamagui-cna"
                name="create-next-app"
                author="srikanthkh"
              />

              <StarterRepoCard
                url="https://github.com/srikanthkh/tamagui-cra"
                name="create-react-app"
                author="srikanthkh"
              />

              <StarterRepoCard
                url="https://github.com/criszz77/luna"
                name="Luna template"
                author="criszz77"
              />

              <StarterRepoCard
                url="https://github.com/chen-rn/create-universal-app"
                name="create-universal-app"
                author="Chen"
              />

              <StarterRepoCard
                url="https://github.com/tamagui/tamagui/tree/main/apps/site"
                name="tamagui.dev"
                author="nate"
              />

              <StarterRepoCard
                url="https://github.com/ivopr/tamagui-expo"
                name="Tamagui Expo"
                author="Ivo"
              />

              <StarterRepoCard
                url="https://github.com/dohomi/tamagui-kitchen-sink"
                name="Kitchen Sink with Storybook"
                author="dohomi"
              />

              <StarterRepoCard
                url="https://github.com/ebg1223/t3-tamagui"
                name="Tamagui t3"
                author="ebg1223"
              />
            </XStack>
          </ScrollView>
        </FlatBubbleCard>

        <Spacer />

        <SponsorCarousel />

        <Spacer />
      </ContainerLarge>

      <Spacer size="$10" />
    </ThemeNameEffect>
  )
}

const StarterRepoCard = ({
  author,
  name,
  url,
}: {
  url: Href
  name: string
  author: string
}) => {
  return (
    <Card
      flex={1}
      flexBasis={0}
      maxW={300}
      gap="$2"
      tag="a"
      // @ts-ignore
      href={url as string}
      target="_blank"
      p="$5"
      justify="space-between"
      hoverStyle={{
        scale: 1.02,
        opacity: 0.9,
      }}
      pressStyle={{
        scale: 0.98,
      }}
    >
      <YStack gap="$2">
        <GithubIcon />
        <H4 cursor="pointer" fontFamily="$silkscreen" letterSpacing={0}>
          {name}
        </H4>
      </YStack>
      <Paragraph cursor="pointer" theme="alt2">
        by {author}
      </Paragraph>
    </Card>
  )
}

// export function getStaticProps() {
//   const frontmatters = getAllFrontmatter('blog')
//   const sortedFrontmatters = frontmatters.sort(
//     (a, b) =>
//       Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
//   )
//   return { props: { frontmatters: sortedFrontmatters.slice(0, 3) } }
// }
