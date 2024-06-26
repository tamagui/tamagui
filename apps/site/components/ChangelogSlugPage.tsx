import { Container } from '@components/Container'
import { components } from '@components/MDXComponents'
import { authors } from '@data/authors'
import { useTint } from '@tamagui/logo'
import { Sparkles } from '@tamagui/lucide-icons'
import {
  H3,
  Image,
  Paragraph,
  Separator,
  Spacer,
  Theme,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import type { Frontmatter } from '../frontmatter'
import { NextLink } from './NextLink'
import type { MutableRefObject } from 'react'
import { useScrollObserver } from './useScrollObserver'

export type ChangelogPost = {
  index: number
  sectionRef: MutableRefObject<null>
  onIntersect: () => void
  frontmatter: Frontmatter
  code: any
  Component?: any
}

function ChangelogArticleHeader({ sectionRef, frontmatter }: ChangelogPost) {
  const { tint } = useTint()

  const enc = encodeURIComponent
  const authorTwitter = authors?.[frontmatter.by || '']?.twitter
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js changelog.`
  const tweetUrl = `https://tamagui.dev/changelog/${frontmatter.slug}`
  const twitterShare = `https://twitter.com/intent/tweet?text="${enc(
    tweetText
  )}"&url=${enc(tweetUrl)}`

  return (
    <Theme name={tint as any}>
      <YStack
        pt="$2.5"
        mb="$4"
        pos="relative"
        id={frontmatter.publishedAt}
        ref={sectionRef}
      >
        <LinearGradient fullscreen colors={['$background', 'transparent']} br="$5" />
        <Container>
          <View ai="flex-start" mt="$2">
            <XStack ai="center" gap="$2" bg="$color5" px="$2.5" py="$1" br="$4">
              <Sparkles size={15} col="$color10" />
              <Paragraph col="$color10" fos="$2">
                {frontmatter.description}
              </Paragraph>
            </XStack>
          </View>

          <H3 ls={-1} mt="$5" mb="$2">
            {frontmatter.title}
          </H3>

          <XStack ai="center" jc="space-between">
            <XStack ai="center" my="$3">
              <Paragraph o={0.4} tag="time" size="$3" theme="alt2" whiteSpace="nowrap">
                {Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  year: 'numeric',
                  day: 'numeric',
                }).format(new Date(frontmatter.publishedAt || ''))}
              </Paragraph>

              <Separator vertical mx="$2" />

              <Paragraph o={0.4} size="$3" theme="alt2">
                {frontmatter.readingTime?.text}
              </Paragraph>
            </XStack>
            <Paragraph o={0.75} theme="alt1">
              Share this post on{' '}
              <NextLink
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                title="Share this post on Twitter"
              >
                Twitter
              </NextLink>
              .
            </Paragraph>
          </XStack>
        </Container>

        <Spacer />

        <Separator />
      </YStack>
    </Theme>
  )
}

export function ChangelogSlugPage(props: ChangelogPost) {
  const { frontmatter, Component, index, onIntersect } = props

  const sectionRef = useScrollObserver({
    index,
    onIntersect,
  })

  return (
    <>
      <ChangelogArticleHeader {...props} sectionRef={sectionRef} />

      <Container>
        {frontmatter.poster && (
          <Image
            source={{
              uri: `./${frontmatter.poster}`,
              width: 600,
              height: 300,
            }}
            objectFit="contain"
            w="100%"
          />
        )}

        <YStack tag="article" px="$2">
          <Component components={components as any} />
        </YStack>

        <Separator my="$8" mx="auto" />
      </Container>
    </>
  )
}
