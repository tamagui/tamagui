import { Container } from '@components/Container'
import { components } from '@components/MDXComponents'
import { authors } from '@data/authors'
import { useTint } from '@tamagui/logo'
import { Sparkles } from '@tamagui/lucide-icons'
import {
  Avatar,
  Button,
  H1,
  H2,
  H3,
  Paragraph,
  Separator,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import type { Frontmatter } from '../frontmatter'
import { NextLink } from './NextLink'
import { useEffect, useState, type MutableRefObject } from 'react'
import { useScrollObserver } from './useScrollObserver'

export type ChangelogPost = {
  index: number
  sectionRef: MutableRefObject<null>
  onIntersect: () => void
  frontmatter: Frontmatter
  code: any
  // relatedPosts?: Frontmatter[]
  Component?: any
}

function ChangelogArticleHeader({ sectionRef, frontmatter }: ChangelogPost) {
  const { tint } = useTint()

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
          <YStack mt="$2" ai="flex-start">
            <XStack
              ai="center"
              gap="$2"
              theme="yellow"
              bg="$yellow5"
              px="$2.5"
              py="$1"
              br="$4"
            >
              <Sparkles size={15} col="$color" />
              <Paragraph col="$color" fos="$2">
                {frontmatter.description}
              </Paragraph>
            </XStack>
          </YStack>

          <H2 letterSpacing={-1} mt="$5" mb="$2">
            {frontmatter.title}
          </H2>

          <XStack ai="center" my="$3">
            {/* <Avatar src={authors[frontmatter.by].avatar} mr={2} /> */}

            <Paragraph size="$3" theme="alt2" whiteSpace="nowrap">
              <NextLink
                href={`https://twitter.com/${authors?.[frontmatter.by || '']?.twitter}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {authors?.[frontmatter.by || '']?.name}
              </NextLink>
            </Paragraph>

            <Separator vertical mx="$2" />

            <Paragraph o={0.4} tag="time" size="$3" theme="alt2" whiteSpace="nowrap">
              {Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric',
                day: 'numeric',
              }).format(new Date(frontmatter.publishedAt || ''))}
            </Paragraph>

            <Separator vertical mx="$2" />

            <YStack ai="center" display="none" $gtSm={{ display: 'flex' }}>
              <Paragraph o={0.4} size="$3" theme="alt2">
                {frontmatter.readingTime?.text}
              </Paragraph>

              {frontmatter.type === 'changelog' && (
                <>
                  <Separator vertical mx="$2" />
                  <Button>Changelog</Button>
                </>
              )}
            </YStack>
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
  const enc = encodeURIComponent
  const authorTwitter = authors?.[frontmatter.by || '']?.twitter
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js changelog.`
  const tweetUrl = `https://tamagui.dev/changelog/${frontmatter.slug}`
  const twitterShare = `https://twitter.com/intent/tweet?text="${enc(
    tweetText
  )}"&url=${enc(tweetUrl)}`

  const sectionRef = useScrollObserver({
    section: `${index}-${frontmatter.publishedAt}`,
    onIntersect,
  })

  return (
    <>
      <ChangelogArticleHeader {...props} sectionRef={sectionRef} />

      <Container>
        <YStack tag="article" px="$2">
          <Component components={components as any} />
        </YStack>

        <Separator my="$8" mx="auto" />

        <YStack mb="$8" ai="center">
          <Paragraph>
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
        </YStack>

        {/* {relatedPosts && (
          <YStack>
            <Separator my="$8" mx="auto" />
            <H3 mb="$3" ta="center" textTransform="uppercase">
              Related
            </H3>

            <YStack my="$4" gap="$4">
              {relatedPosts.map((frontmatter) => {
                return (
                  <Paragraph
                    tag="a"
                    key={frontmatter.slug}
                    // @ts-ignore
                    href={`/changelog/${frontmatter.slug}`}
                  >
                    <YStack gap="$2">
                      <H6>{frontmatter.title}</H6>
                      <Paragraph>{frontmatter.description}</Paragraph>
                    </YStack>
                  </Paragraph>
                )
              })}
            </YStack>
          </YStack>
        )} */}
      </Container>
    </>
  )
}
