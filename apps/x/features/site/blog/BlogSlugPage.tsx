import { useTint } from '@tamagui/logo'
import { ArrowLeft } from '@tamagui/lucide-icons'
import type { Frontmatter } from '@tamagui/mdx'
import { usePathname } from '@vxrn/router'
import {
  Button,
  H1,
  H2,
  H3,
  H6,
  Paragraph,
  Separator,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'
import { Container } from '~/components/Containers'
import { Link } from '~/components/Link'
import { authors } from '~/data/authors'
import { components } from '~/features/mdx/MDXComponents'

export type BlogPost = {
  frontmatter: Frontmatter
  code: any
  relatedPosts?: Frontmatter[] | null
  Component?: any
}

export function BlogArticleHeader({ frontmatter }: BlogPost) {
  const pathname = usePathname()
  const isDraft = pathname.startsWith('/draft')
  const { tint } = useTint()
  return (
    <Theme name={tint as any}>
      <YStack mt="$-10" pt="$10" mb="$4" pos="relative">
        <LinearGradient fullscreen colors={['$background', 'transparent']} />
        <Container>
          <YStack mt="$2" ai="flex-start">
            <Link href={isDraft ? '/draft' : '/blog'}>
              <Button size="$3" chromeless icon={ArrowLeft} ml="$-2" theme="alt1">
                {isDraft ? 'Drafts' : 'Blog'}
              </Button>
            </Link>
          </YStack>

          <H1 letterSpacing={-1} mt="$5" mb="$2">
            {frontmatter.title}
          </H1>

          <H2 o={0.5} theme="alt2" size="$7" fontWeight="500" fontFamily="$body" mb="$1">
            {frontmatter.description}
          </H2>

          <XStack ai="center" my="$3">
            {/* <Avatar src={authors[data.by].avatar} mr={2} /> */}

            <Paragraph size="$3" theme="alt2" whiteSpace="nowrap">
              <Link
                href={`https://twitter.com/${authors?.[frontmatter.by || '']?.twitter}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {authors?.[frontmatter.by || '']?.name}
              </Link>
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

export function BlogSlugPage(props: BlogPost) {
  const { frontmatter, relatedPosts, Component } = props
  const enc = encodeURIComponent
  const authorTwitter = authors?.[frontmatter.by || '']?.twitter
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js blog.`
  const tweetUrl = `https://tamagui.dev/blog/${frontmatter.slug}`
  const twitterShare = `https://twitter.com/intent/tweet?text="${enc(
    tweetText
  )}"&url=${enc(tweetUrl)}`

  return (
    <>
      <BlogArticleHeader {...props} />

      <Container>
        <YStack tag="article" px="$2">
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
                  <Paragraph
                    tag="a"
                    key={frontmatter.slug}
                    // @ts-ignore
                    href={`/blog/${frontmatter.slug}`}
                  >
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
    </>
  )
}
