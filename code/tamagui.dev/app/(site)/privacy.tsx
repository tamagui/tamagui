export default () => null

// TODO
// import { components } from '@components/MDXComponents'
// import { getDefaultLayout } from '@lib/getDefaultLayout'
// import { getMdxBySlug } from '@lib/mdx'
// import { getOgUrl } from '@lib/og'
// import { ThemeTint } from '@tamagui/logo'
// import { getMDXComponent } from 'mdx-bundler/client'
// import { NextSeo } from 'next-seo'
// import React from 'react'
// import { Spacer } from 'tamagui'

// import { HomeH1 } from '@components/HomeH2'
// import { SubTitle, nbspLastWord } from '@components/SubTitle'
// import type { Frontmatter } from 'frontmatter'
// import { Container } from '../components/Container'

// type Doc = {
//   frontmatter: Frontmatter
//   code: any
// }

// export default function Page({ frontmatter, code }: Doc) {
//   if (!frontmatter) {
//     return null
//   }
//   const Component = React.useMemo(() => getMDXComponent(code), [code])
//   return (
//     <>
//       <NextSeo
//         title={`${frontmatter.title} — Tamagui`}
//         description={frontmatter.description}
//         openGraph={{
//           images: [
//             {
//               url: getOgUrl('default', {
//                 title: frontmatter.title,
//                 description: frontmatter.description ?? '',
//                 category: 'intro',
//               }),
//             },
//           ],
//         }}
//       />
//       <Container py="$10" gap="$5">
//         {!!frontmatter.title && <HomeH1>{nbspLastWord(frontmatter.title)}</HomeH1>}
//         {!!frontmatter.description && <SubTitle>{frontmatter.description}</SubTitle>}
//         <ThemeTint>
//           <Component components={components as any} />
//         </ThemeTint>
//       </Container>
//     </>
//   )
// }

// Page.getLayout = getDefaultLayout

// export async function getStaticProps() {
//   const { frontmatter, code } = await getMdxBySlug('etc', 'privacy')
//   return {
//     props: {
//       frontmatter,
//       code,
//     },
//   }
// }
