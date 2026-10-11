import { ThemeTint } from '@tamagui/logo'
import { ArrowLeft } from '~/components/icons'
import type { Frontmatter } from '@vxrn/mdx-rust'
import { H1, H3, H6, Paragraph, Separator, View, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
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
    <YStack mt="-11" pt="88px" mb="8" position="relative">
      <Container>
        <YStack mt="1-5" items="flex-start">
          <ThemeTint>
            <Link href={isDraft ? '/draft' : '/blog'}>
              <Button size="sm" variant="quiet" icon={ArrowLeft} ml="-1-5">
                <Button.Text>{isDraft ? 'Drafts' : 'Blog'}</Button.Text>
              </Button>
            </Link>
          </ThemeTint>
        </YStack>

        {/* title, then one muted color and one small size for everything
            under it, on an even rhythm */}
        <YStack mt="6" gap="3">
          <H1 color="color-11">{frontmatter.title}</H1>

          <Paragraph fontSize={18} lineHeight="28px" color="color-10">
            {frontmatter.description}
          </Paragraph>

          <XStack items="center" gap="1-5">
            <Link
              href={`https://x.com/${authors?.[frontmatter.by || '']?.twitter}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Paragraph size="3" color="color-10" whiteSpace="nowrap">
                {authors?.[frontmatter.by || '']?.name}
              </Paragraph>
            </Link>

            <Paragraph size="3" color="color-10">
              ·
            </Paragraph>

            <Paragraph color="color-10" whiteSpace="nowrap" render="time" size="3">
              {Intl.DateTimeFormat('en-US', {
                month: 'short',
                timeZone: 'UTC',
                year: 'numeric',
                day: 'numeric',
              }).format(new Date(frontmatter.publishedAt || ''))}
            </Paragraph>

            <XStack items="center" gap="1-5" display="none md:flex">
              <Paragraph size="3" color="color-10">
                ·
              </Paragraph>
              <Paragraph color="color-10" size="3">
                {frontmatter.readingTime?.text}
              </Paragraph>

              {frontmatter.type === 'changelog' && (
                <Button>
                  <Button.Text>Changelog</Button.Text>
                </Button>
              )}
            </XStack>
          </XStack>
        </YStack>
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
          <YStack pb="8">
            <View
              rounded="4"
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

        <YStack render="article">
          <Component components={components as any} />
        </YStack>

        <Separator my="11" mx="auto" />

        {relatedPosts && (
          <YStack>
            <Separator my="11" mx="auto" />
            <H3 mb="3" text="center" textTransform="uppercase">
              Related
            </H3>

            <YStack my="4" gap="4">
              {relatedPosts.map((frontmatter) => {
                return (
                  <Paragraph
                    render="a"
                    key={frontmatter.slug}
                    // @ts-ignore
                    href={`/blog/${frontmatter.slug}`}
                  >
                    <YStack gap="1-5">
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
