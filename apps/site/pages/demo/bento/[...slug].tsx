import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { YStack } from 'tamagui'

export default function DemoComponentsPage(props) {
  const router = useRouter()
  const slug = Array.isArray(router?.query?.slug)
    ? router.query.slug
    : router.query.slug
      ? [router.query.slug]
      : null
  const componentName = router.query.name
  if (!slug || typeof componentName !== 'string') {
    return null
  }

  const Component = dynamic(
    () =>
      import(
        /* webpackExclude: /\.native\.tsx$/ */
        `@tamagui/bento/src/components/${slug.join('/')}/index`
      )
        .then((mod) => {
          return mod[componentName]
        })
        .catch(console.error),
    { ssr: false }
  )
  // let Component: any = null
  // for (const part of slug) {
  //   Component = Component ? Component[part] : Bento[part]
  //   console.log(Component)
  // }

  if (!Component) {
    return null
  }
  const name = 'Bento Demo'
  return (
    <>
      <NextSeo
        title={`${
          name || ''
        } Component — Tamagui — style library, design system, and UI kit for React (Native and web)`.trim()}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `body{background-color: transparent!important}`,
        }}
      />
      <YStack group="window" f={1} ai="center" jc="center">
        <Component />
      </YStack>
    </>
  )
}
