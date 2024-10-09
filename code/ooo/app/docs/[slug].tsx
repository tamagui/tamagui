import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import { H1 } from 'tamagui'
import { useLoader } from 'one'
import { DocsRightSidebar } from '~/features/docs/DocsRightSidebar'
import { components } from '~/features/docs/MDXComponents'
import { HeadInfo } from '~/features/site/HeadInfo'
import { nbspLastWord, SubTitle } from '~/features/site/SubTitle'

export async function generateStaticParams() {
  const { getAllFrontmatter } = await import('@tamagui/mdx')
  const frontmatters = getAllFrontmatter('data/docs')
  const paths = frontmatters.map(({ slug }) => ({
    slug: slug.replace(/.*docs\//, ''),
  }))
  return paths
}

export async function loader({ params }) {
  const { getMDXBySlug } = await import('@tamagui/mdx')
  const { frontmatter, code } = await getMDXBySlug('data/docs', params.slug)
  return {
    frontmatter,
    code,
  }
}

export function DocCorePage() {
  const { code, frontmatter } = useLoader(loader)
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <>
      <HeadInfo
        title={`${frontmatter.title || frontmatter.description}`}
        description={frontmatter.description}
        openGraph={
          {
            // images: [
            //   {
            //     url: getOgUrl({
            //       title: frontmatter.title,
            //       description: frontmatter.description ?? '',
            //       category: 'intro',
            //     }),
            //   },
            // ],
          }
        }
      />

      <>
        {/* @ts-ignore */}
        {!frontmatter.hideTitle && (
          <>
            <H1
              mb="$4"
              mt="$2"
              $platform-web={{
                textWrap: 'balance',
              }}
            >
              {nbspLastWord(frontmatter.title)}
            </H1>
            {!!frontmatter.description && (
              <SubTitle>{nbspLastWord(frontmatter.description || '')}</SubTitle>
            )}
          </>
        )}
        <Component components={components as any} />
        <DocsRightSidebar headings={frontmatter.headings} />
      </>
    </>
  )
}
