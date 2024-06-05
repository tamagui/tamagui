import { authors } from '@data/authors'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx'
import { NextSeo } from 'next-seo'
import { H2, Spacer, YStack } from 'tamagui'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ContainerLarge } from '../../components/Container'
import { NextLink } from '../../components/NextLink'
import { TamaguiCard } from '../../components/TamaguiCard'

import { getMDXComponent } from 'mdx-bundler/client'
import { getCompilationExamples } from '@lib/getCompilationExamples'
import { ChangelogSlugPage } from '@components/ChangelogSlugPage'
import { TamaguiExamples } from '@components/TamaguiExamplesCode'
import { PublishedDateSidebar } from '@components/PublishedDateSidebar'

export default function Changelog(props) {
  const Components = useMemo(
    () => props.mdxData.map((data) => getMDXComponent(data.code)),
    [props.mdxData]
  )

  const [section, setSection] = useState('')

  const onIntersect = (intersectedSection) => {
    setSection(intersectedSection)
  }

  // useEffect(() => {
  //   window.scrollBy({
  //     left: 0,
  //     top: -195,
  //     behavior: 'smooth',
  //   })
  // }, [section])

  return (
    <>
      <NextSeo title="Changelog — Tamagui" description="What's up with Tamagui." />
      <Spacer size="$7" />
      <H2 als="center" size="$8" theme="alt2" fontFamily="$silkscreen">
        Changelog
      </H2>

      <YStack
        tag="aside"
        mx="auto"
        display="none"
        $gtLg={{
          display: 'flex',
          // width: 280,
          flexShrink: 0,
          zIndex: 1,
          position: 'fixed' as any,
          right: '50%',
          top: 195,
          marginRight: 425,
        }}
      >
        <PublishedDateSidebar mdxData={props.mdxData} section={section} />
      </YStack>

      <ContainerLarge
        mt="$10"
        mb="$8"
        jc="space-between"
        maxWidth="100%"
        flex={1}
        $gtLg={{
          l: -50,
        }}
        $gtMd={{
          pb: '$9',
          pl: 250,
          // pr: 100,
        }}
      >
        {props.mdxData.map((data, index) => (
          <TamaguiExamples.Provider key={data.frontmatter.title} value={data['examples']}>
            <ChangelogSlugPage
              Component={Components[index]}
              {...data}
              index={index}
              onIntersect={onIntersect}
            />
          </TamaguiExamples.Provider>

          // <NextLink
          //   legacyBehavior={false}
          //   key={data.frontmatter.title}
          //   href={data.frontmatter.slug}
          //   passHref
          // >
          //   <TamaguiCard
          //     $gtSm={{
          //       width: '50%',
          //       maxWidth: 'calc(50% - var(--space-8))',
          //     }}
          //     title={data.frontmatter.title}
          //     subTitle={
          //       <Paragraph o={0.5} cursor="inherit" theme="alt1" size="$3">
          //         {Intl.DateTimeFormat('en-US', {
          //           month: 'short',
          //           year: 'numeric',
          //           day: 'numeric',
          //         }).format(new Date(data.frontmatter.publishedAt || ''))}{' '}
          //         by &nbsp;
          //         {authors[data.frontmatter.by].name}
          //       </Paragraph>
          //     }
          //   >
          //     {data.frontmatter.description}
          //   </TamaguiCard>
          // </NextLink>
        ))}
      </ContainerLarge>
    </>
  )
}

Changelog.getLayout = getDefaultLayout

export async function getStaticProps() {
  const frontmatters = getAllFrontmatter('changelog')
  const sortedFrontmatters = frontmatters
    .filter((x) => !x.draft)
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
    )

  const mdxData = await Promise.all(
    sortedFrontmatters.map(async ({ slug }) => {
      const { frontmatter, code } = await getMdxBySlug(
        'changelog',
        slug.replace('changelog/', '')
      )
      return { frontmatter, code, examples: getCompilationExamples() }
    })
  )

  return {
    props: {
      mdxData,
    },
  }
}

// export function getStaticProps() {
//   const frontmatters = getAllFrontmatter('changelog')
//   const sortedFrontmatters = frontmatters
//     .filter((x) => !x.draft)
//     .sort(
//       (a, b) =>
//         Number(new Date(b.publishedAt || '')) - Number(new Date(a.publishedAt || ''))
//     )
//   return { props: { frontmatters: sortedFrontmatters } }
// }
