// import { getAllFrontmatter } from '@lib/mdx'
import { useTint } from '@tamagui/logo'
import { ChevronRight } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
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

import type { Href } from 'one'
import { Card } from '~/components/Card'
import { ContainerLarge } from '~/components/Containers'
import { FlatBubbleCard } from '~/components/FlatBubbleCard'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { SocialLinksRow } from '~/features/site/home/SocialLinksRow'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'

export default function Community() {
  return (
    <CommunityLayout>
      <ThemeNameEffect />
      <HeadInfo title="Community" />

      <Spacer size="$4" />

      <ContainerLarge space="$4">
        <Spacer />

        <H1 als="center">Community</H1>

        <Spacer />

        <SocialLinksRow />

        <Spacer />

        <XStack $sm={{ flexDirection: 'column' }}>
          <FlatBubbleCard w="50%" $sm={{ w: 'auto' }} ai="center" bw={0}>
            <Link href="/blog">
              <Button
                bg="transparent"
                bc="$borderColor"
                bw={1}
                mt="$-3"
                size="$6"
                iconAfter={ChevronRight}
                br="$10"
              >
                <H2 cur="pointer" size="$9" ta="center">
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

          <FlatBubbleCard ai="center" feature bw={0}>
            <H2 size="$9" ta="center">
              Figma Design Kit
            </H2>
            <Spacer size="$6" />
            <YStack ai="center" gap="$4">
              <Link href="https://www.figma.com/community/file/1326593766534421119">
                <YStack
                  target="_blank"
                  rel="noopener noreferrer"
                  br="$5"
                  overflow="hidden"
                  bw={0.5}
                  bc="$borderColor"
                >
                  <Image
                    animation="quick"
                    cur="pointer"
                    shac="$shadowColor"
                    shar="$4"
                    hoverStyle={{
                      scale: 1.2,
                      borderColor: '$color',
                    }}
                    o={0.5}
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

        <FlatBubbleCard bw={0.5} gap="$4">
          <H3 id="starter-repos" ta="center">
            Starter repos & Guides
          </H3>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack py="$2" space="$4">
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
                url="https://github.com/tamagui/tamagui/tree/master/apps/site"
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

        <FlatBubbleCard bw={0}>
          <H2 size="$9" ta="center" className="rainbow clip-text">
            Enterprise Sponsors
          </H2>
        </FlatBubbleCard>

        <XStack gap="$4" jc="center" ai="center" flexWrap="wrap">
          <GoldSponsor
            name="Uniswap"
            bg="#FF007A"
            link="https://uniswap.org"
            image="/sponsors/uniswap.jpeg"
            imageWidth={250}
            imageHeight={250}
          />

          <GoldSponsor
            name="Medbill AI"
            bg="#888"
            link="https://www.medbill.ai"
            image="/sponsors/medbill-ai.png"
            imageWidth={800 * 0.3}
            imageHeight={173 * 0.3}
          />
        </XStack>

        <FlatBubbleCard bw={0}>
          <H2 size="$9" ta="center" color="$yellow10">
            Gold Sponsors
          </H2>
        </FlatBubbleCard>

        <XStack gap="$4" jc="center" ai="center" flexWrap="wrap">
          <GoldSponsor
            name="Appfolio"
            link="https://www.appfolio.com/"
            image="/sponsors/appfolio.jpeg"
            imageWidth={150}
            imageHeight={150}
          />
          <GoldSponsor
            name="Manifold Finance"
            link="https://www.manifoldfinance.com"
            image="/sponsors/manifold.png"
            imageWidth={100}
            imageHeight={100}
          />
        </XStack>

        <Spacer />

        <FlatBubbleCard bw={0}>
          <H2 size="$9" ta="center">
            Bronze Sponsors
          </H2>
        </FlatBubbleCard>

        <XStack gap="$4" jc="center" ai="center" flexWrap="wrap">
          <GoldSponsor
            name="Bounty"
            link="https://bounty.co"
            image="/sponsors/bounty.png"
            imageWidth={100}
            imageHeight={100}
          />
          <GoldSponsor
            name="Meteor"
            link="https://meteorwallet.app"
            image="/sponsors/meteor.png"
            imageWidth={100}
            imageHeight={100}
          />
        </XStack>

        <Spacer />

        <FlatBubbleCard bw={0}>
          <H2 size="$9" ta="center">
            Indie Sponsors
          </H2>
        </FlatBubbleCard>

        <XStack gap="$4" jc="center" ai="center" flexWrap="wrap">
          <GoldSponsor
            name="CodingScape"
            link="https://codingscape.com"
            image="/sponsors/coding-scape.png"
            imageWidth={566 * 0.35}
            imageHeight={162 * 0.35}
          />
          <GoldSponsor
            name="Quest Portal"
            link="https://www.questportal.com"
            image="/sponsors/quest-portal.png"
            imageWidth={200 * 0.3}
            imageHeight={200 * 0.3}
          />
          <GoldSponsor
            name="BeatGig"
            link="https://beatgig.com"
            image="/sponsors/beatgig.jpg"
            imageWidth={400 * 0.5}
            imageHeight={84 * 0.5}
          />
          <GoldSponsor
            name="Pineapples.dev"
            link="http://pineapples.dev"
            image="/sponsors/pineapple.jpg"
            imageWidth={520 * 0.5}
            imageHeight={186 * 0.5}
          />
        </XStack>

        <Spacer />

        <FlatBubbleCard bw={0}>
          <H2 size="$9" ta="center">
            Early Sponsors
          </H2>
        </FlatBubbleCard>

        <XStack space flexWrap="wrap">
          <IndividualSponsor name="@barelyreaper" link="https://x.com/barelyreaper" />
          <IndividualSponsor name="@pontusab" link="https://x.com/pontusab" />
          <IndividualSponsor name="@AntelaBrais" link="https://x.com/AntelaBrais" />
          <IndividualSponsor name="Hirbod" link="https://x.com/nightstomp" />
          <IndividualSponsor name="Dimension" link="https://x.com/joindimension" />
        </XStack>
      </ContainerLarge>

      <Spacer size="$10" />
    </CommunityLayout>
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
      f={1}
      fb={0}
      maw={300}
      space="$2"
      tag="a"
      href={url as string}
      target="_blank"
      p="$5"
      jc="space-between"
    >
      <YStack gap="$2">
        <GithubIcon />
        <H4 cursor="pointer" fontFamily="$silkscreen" ls={0}>
          {name}
        </H4>
      </YStack>
      <Paragraph cursor="pointer" theme="alt2">
        by {author}
      </Paragraph>
    </Card>
  )
}

function GoldSponsor(props: {
  name: string
  link: Href
  image: string
  imageWidth: number
  imageHeight: number
  bg?: any
}) {
  return (
    <FlatBubbleCard mb="$4" flat p={0} fb={0} bg={props.bg}>
      <Link href={props.link} target="_blank">
        <YStack
          ai="center"
          jc="center"
          f={1}
          cursor="pointer"
          target="_blank"
          p="$8"
          br="$4"
          space
        >
          <Image
            accessibilityLabel={props.name}
            source={{
              uri: props.image,
              height: props.imageHeight,
              width: props.imageWidth,
            }}
          />
          <H5 ta="center" cursor="inherit" als="center" letterSpacing={4} ai="center">
            {props.name}
          </H5>
        </YStack>
      </Link>
    </FlatBubbleCard>
  )
}

function IndividualSponsor(props: { name: string; link: string }) {
  return (
    <FlatBubbleCard flat mb="$4">
      <YStack maxWidth="100%" fs={0} als="center">
        <XStack gap="$4" $sm={{ flexDirection: 'column' }}>
          <Link href={props.link as any} target="_blank">
            <YStack
              cursor="pointer"
              p="$4"
              br="$4"
              hoverStyle={{ bg: 'rgba(0,0,0,0.1)' }}
              pressStyle={{ bg: 'rgba(0,0,0,0.2)' }}
              space
            >
              <H5 cursor="inherit" als="center" letterSpacing={4} ai="center">
                {props.name}
              </H5>
            </YStack>
          </Link>
        </XStack>
      </YStack>
    </FlatBubbleCard>
  )
}

function CommunityLayout({ children }: { children: any }) {
  const { tint } = useTint()
  return (
    <YStack debug="verbose" theme={tint as any}>
      {useMemo(() => children, [children])}
    </YStack>
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
