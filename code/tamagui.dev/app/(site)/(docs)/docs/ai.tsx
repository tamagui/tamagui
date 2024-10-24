import { ThemeTint } from '@tamagui/logo'
import { getMDXComponent } from 'mdx-bundler/client'
import { useLoader } from 'one'
import { Fragment, useMemo } from 'react'
import { H1, H2 } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { components } from '~/features/mdx/MDXComponents'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function loader() {
  // const { getAllFrontmatter, getMDXBySlug } = await import('@tamagui/mdx-2')
  // const docsSubFolders = ['intro', 'core', 'guides', 'components']
  // const allDocsItems = docsSubFolders.flatMap((folder) => {
  //   const frontmatters = getAllFrontmatter(`data/docs/${folder}`)
  //   return frontmatters.map(({ slug }) => ({
  //     slug: slug.replace(/.*docs\/[a-z]+\//, ''),
  //     folder,
  //   }))
  // })
  // const allDocs = await Promise.all(
  //   allDocsItems.map(async ({ slug, folder }) => {
  //     const { frontmatter, code } = await getMDXBySlug(`data/docs/${folder}`, slug)
  //     return {
  //       slug,
  //       folder,
  //       frontmatter,
  //       code,
  //     }
  //   })
  // )
  // return allDocs
}

export default () => <H1>Coming...</H1>

// export default function AIDocsPage() {
//   const allDocs = useLoader(loader)

//   const allComponents = useMemo(
//     () =>
//       allDocs.map((doc) => {
//         return {
//           ...doc,
//           Component: getMDXComponent(doc.code),
//         }
//       }),
//     [allDocs]
//   )

//   return (
//     <>
//       <HeadInfo
//         title={`Docs for AI`}
//         description="All Tamagui docs in one page, for LLMs to use"
//       />

//       <ThemeTint>
//         <HomeH1>Docs for AI</HomeH1>
//         <SubTitle>All Tamagui docs in one page - for easy usage with AI</SubTitle>

//         {allComponents.map(({ Component, frontmatter }, i) => {
//           return (
//             <Fragment key={i}>
//               <H2>{nbspLastWord(frontmatter.title)}</H2>
//               <SubTitle>{nbspLastWord(frontmatter.description || '')}</SubTitle>
//               <Component components={components} />
//             </Fragment>
//           )
//         })}
//       </ThemeTint>
//     </>
//   )
// }
