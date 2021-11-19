import { Container } from '@components/Container'
import { Header } from '@components/Header'
import { components } from '@components/MDXComponents'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { authors } from '@data/authors'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { ArrowLeft } from '@tamagui/feather-icons'
import { format, parseISO } from 'date-fns'
import { getMDXComponent } from 'mdx-bundler/client'
import NextLink from 'next/link'
import React from 'react'
import { Button, H1, H2, H3, H6, Paragraph, Separator, Text, XStack, YStack } from 'tamagui'

import { Link } from '../../components/Link'
import { Frontmatter } from '../../types/frontmatter'

type BlogPost = {
  frontmatter: Frontmatter
  code: any
  relatedPosts?: Frontmatter[]
}

export default function BlogPost({ frontmatter, code, relatedPosts }: BlogPost) {
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  const twitterShare = `
		https://twitter.com/intent/tweet?
		text="${frontmatter.title}" by @${
    authors[frontmatter.by].twitter
  } on the @tamagui_dev blog.&url=https://tamagui.dev/blog/${frontmatter.slug}
		`

  return (
    <>
      <TitleAndMetaTags title={`${frontmatter.title} — Tamagui`} poster={frontmatter.poster} />
      <Header />

      <Container>
        <YStack ai="flex-start">
          <NextLink href="/blog" passHref>
            <Button
              chromeless
              icon={<ArrowLeft color="var(--color3)" size={12} />}
              tag="a"
              space="$2"
              ml="$-6"
            >
              Blog
            </Button>
          </NextLink>
        </YStack>

        <H1 letterSpacing={-1} mt="$4">
          {frontmatter.title}
        </H1>

        <H2 size="$7" fontWeight="500" fontFamily="$body" mb="$2" color="$color2">
          {frontmatter.description}
        </H2>

        <XStack ai="center" mb="$3">
          {/* <Avatar src={authors[data.by].avatar} mr={2} /> */}

          <Paragraph size="$3" color="$color3" whiteSpace="nowrap">
            <Link
              href={`https://twitter.com/${authors[frontmatter.by].twitter}`}
              rel="noopener noreferrer"
              variant="subtle"
            >
              {authors[frontmatter.by].name}
            </Link>
          </Paragraph>

          <Separator vertical mx="$2" />

          <Paragraph tag="time" size="$3" color="$color3" whiteSpace="nowrap">
            {format(parseISO(frontmatter.publishedAt), 'MMMM yyyy')}
          </Paragraph>

          <YStack ai="center" display="none" $gtSm={{ display: 'flex' }}>
            <Separator vertical mx="$2" />
            <Paragraph size="$3" color="$color3">
              {frontmatter.readingTime.text}
            </Paragraph>
            {frontmatter.type === 'changelog' && (
              <>
                <Separator vertical mx="$2" />
                <Button>Changelog</Button>
              </>
            )}
          </YStack>
        </XStack>

        <Component components={components as any} />

        <Separator my="$8" mx="auto" />

        <YStack ai="center">
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
    </>
  )
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('blog')
  console.log('frontmatters', frontmatters)
  return {
    paths: frontmatters.map(({ slug }) => ({ params: { slug: slug.replace('blog/', '') } })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug('blog', context.params.slug)
  const relatedPosts = frontmatter.relatedIds
    ? await Promise.all(
        frontmatter.relatedIds.map(async (id) => {
          const { frontmatter } = await getMdxBySlug('blog', id)
          return frontmatter
        })
      )
    : null
  return {
    props: {
      frontmatter,
      code,
      relatedPosts,
    },
  }
}
