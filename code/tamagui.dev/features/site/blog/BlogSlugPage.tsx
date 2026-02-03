import { ThemeTint } from '@tamagui/logo'
import { ArrowLeft } from '@tamagui/lucide-icons'
import type { Frontmatter } from '@vxrn/mdx'
import {
  Button,
  H1,
  H2,
  H3,
  H6,
  Paragraph,
  Separator,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { LinearGradient } from '@tamagui/linear-gradient'
import { usePathname } from 'one'
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
  return (
    <YStack mt="$-10" pt="$12" mb="$4" position="relative">
      <YStack
        position="absolute"
        inset={0}
        maxH={1000}
        z={0}
        backgroundImage="linear-gradient($color5, $colorTransparent)"
      />

      <Container>
        <YStack mt="$2" items="flex-start">
          <ThemeTint>
            <Link href={isDraft ? '/draft' : '/blog'}>
              <Button size="$3" chromeless icon={ArrowLeft} ml="$-2">
                <Button.Text>{isDraft ? 'Drafts' : 'Blog'}</Button.Text>
              </Button>
            </Link>
          </ThemeTint>
        </YStack>

        <H1 letterSpacing={-1} mt="$5" mb="$2" color="$color11">
          {frontmatter.title}
        </H1>

        <H2
          opacity={0.5}
          color="$color11"
          size="$7"
          fontWeight="500"
          fontFamily="$body"
          mb="$1"
        >
          {frontmatter.description}
        </H2>

        <XStack items="center" my="$3">
          <Link
            href={`https://x.com/${authors?.[frontmatter.by || '']?.twitter}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Paragraph size="$3" color="$color10" whiteSpace="nowrap">
              {authors?.[frontmatter.by || '']?.name}
            </Paragraph>
          </Link>

          <Separator vertical mx="$2" />

          <Paragraph
            opacity={0.4}
            render="time"
            size="$3"
            color="$color10"
            whiteSpace="nowrap"
          >
            {Intl.DateTimeFormat('en-US', {
              month: 'short',
              year: 'numeric',
              day: 'numeric',
            }).format(new Date(frontmatter.publishedAt || ''))}
          </Paragraph>

          <Separator vertical mx="$2" />

          <YStack items="center" display="none" $gtSm={{ display: 'flex' }}>
            <Paragraph opacity={0.4} size="$3" color="$color10">
              {frontmatter.readingTime?.text}
            </Paragraph>

            {frontmatter.type === 'changelog' && (
              <>
                <Separator vertical mx="$2" />
                <Button>
                  <Button.Text>Changelog</Button.Text>
                </Button>
              </>
            )}
          </YStack>
        </XStack>
      </Container>
    </YStack>
  )
}

export function BlogSlugPage(props: BlogPost) {
  const { frontmatter, relatedPosts, Component } = props
  const enc = encodeURIComponent
  const authorTwitter = authors?.[frontmatter.by || '']?.twitter
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js blog.`
  const tweetUrl = `https://tamagui.dev/blog/${frontmatter.slug}`
  const twitterShare = `https://x.com/intent/tweet?text="${enc(
    tweetText
  )}"&url=${enc(tweetUrl)}` as const

  return (
    <>
      <BlogArticleHeader {...props} />

      <Container>
        {frontmatter.image && (
          <YStack pb="$6">
            <View
              rounded="$4"
              overflow="hidden"
              style={{
                aspectRatio: frontmatter.imageMeta
                  ? `${frontmatter.imageMeta.width} / ${frontmatter.imageMeta.height}`
                  : undefined,
                background: frontmatter.imageMeta?.blurDataURL
                  ? `url(${frontmatter.imageMeta.blurDataURL}) center/cover no-repeat`
                  : undefined,
              }}
            >
              <img
                src={frontmatter.image}
                alt={frontmatter.title || ''}
                width={frontmatter.imageMeta?.width}
                height={frontmatter.imageMeta?.height}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: 8,
                }}
              />
            </View>
          </YStack>
        )}

        <YStack render="article" px="$2">
          <Component components={components as any} />
        </YStack>

        <Separator my="$8" mx="auto" />

        {relatedPosts && (
          <YStack>
            <Separator my="$8" mx="auto" />
            <H3 mb="$3" text="center" textTransform="uppercase">
              Related
            </H3>

            <YStack my="$4" gap="$4">
              {relatedPosts.map((frontmatter) => {
                return (
                  <Paragraph
                    render="a"
                    key={frontmatter.slug}
                    // @ts-ignore
                    href={`/blog/${frontmatter.slug}`}
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
        )}
      </Container>
    </>
  )
}
