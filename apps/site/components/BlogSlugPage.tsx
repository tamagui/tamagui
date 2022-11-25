import { Container } from '@components/Container'
import { components } from '@components/MDXComponents'
import { authors } from '@data/authors'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { format, parseISO } from 'date-fns'
import { default as Link, default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import { Button, H1, H2, H3, H6, Paragraph, Separator, Spacer, XStack, YStack } from 'tamagui'

import { Frontmatter } from '../frontmatter'

export type BlogPost = {
  frontmatter: Frontmatter
  code: any
  relatedPosts?: Frontmatter[]
  Component?: any
}

export function BlogSlugPage({ frontmatter, relatedPosts, Component }: BlogPost) {
  const router = useRouter()
  const isDraft = router.pathname.startsWith('/draft')
  const enc = encodeURIComponent
  const authorTwitter = authors[frontmatter.by || ''].twitter
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js blog.`
  const tweetUrl = `https://tamagui.dev/blog/${frontmatter.slug}`
  const twitterShare = `https://twitter.com/intent/tweet?text="${enc(tweetText)}"&url=${enc(
    tweetUrl
  )}`

  return (
    <Container>
      <YStack mt="$2" ai="flex-start">
        <NextLink legacyBehavior href={isDraft ? '/draft' : '/blog'} passHref>
          <Button chromeless icon={ArrowLeft} tag="a" ml="$-2" theme="alt1">
            {isDraft ? 'Drafts' : 'Blog'}
          </Button>
        </NextLink>
      </YStack>

      <H1 letterSpacing={-1} mt="$6" mb="$2">
        {frontmatter.title}
      </H1>

      <H2 theme="alt2" size="$7" fontWeight="500" fontFamily="$body" mb="$1" ls={-0.5}>
        {frontmatter.description}
      </H2>

      <XStack ai="center" my="$3">
        {/* <Avatar src={authors[data.by].avatar} mr={2} /> */}

        <Paragraph size="$3" theme="alt2" whiteSpace="nowrap">
          <Link
            href={`https://twitter.com/${authors[frontmatter.by || ''].twitter}`}
            rel="noopener noreferrer"
            // variant="subtle"
          >
            {authors[frontmatter.by || ''].name}
          </Link>
        </Paragraph>

        <Separator vertical mx="$2" />

        <Paragraph tag="time" size="$3" theme="alt2" whiteSpace="nowrap">
          {format(parseISO(frontmatter.publishedAt || ''), 'MMMM yyyy')}
        </Paragraph>

        <Separator vertical mx="$2" />

        <YStack ai="center" display="none" $gtSm={{ display: 'flex' }}>
          <Paragraph size="$3" theme="alt2">
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

      <Spacer />
      <Separator mx="$-5" />
      <Spacer size="$6" />

      <YStack px="$2">
        <Component components={components as any} />
      </YStack>

      <Separator my="$8" mx="auto" />

      <YStack mb="$8" ai="center">
        <Paragraph>
          Share this post on{' '}
          <Link
            href={twitterShare}
            target="_blank"
            rel="noopener noreferrer"
            title="Share this post on Twitter"
          >
            Twitter
          </Link>
          .
        </Paragraph>
      </YStack>

      {relatedPosts && (
        <YStack>
          <Separator my="$8" mx="auto" />
          <H3 mb="$3" ta="center" textTransform="uppercase">
            Related
          </H3>

          <YStack my="$4" space="$4">
            {relatedPosts.map((frontmatter) => {
              return (
                <Paragraph tag="a" key={frontmatter.slug} href={`/blog/${frontmatter.slug}`}>
                  <YStack space="$2">
                    <H6>{frontmatter.title}</H6>
                    <Paragraph>{frontmatter.description}</Paragraph>
                  </YStack>
                </Paragraph>
              )
            })}
          </YStack>
        </YStack>
      )}
    </Container>
  )
}
