import * as Demos from '@components/demos'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { useRouter } from 'next/router'
import { YStack } from 'tamagui'

export default function DemoComponentsPage(props) {
  const router = useRouter()
  const slug = router?.query?.slug?.[0] || ''
  const name =
    slug
      .split('-')
      .map((x) => (x ? x[0].toUpperCase() + x.slice(1) : ''))
      .join('') + `Demo`
  const Component = Demos[name]
  if (!Component) {
    return null
  }
  return (
    <>
      <TitleAndMetaTags
        title={`${name || ''} Component — Tamagui — React Native Universal UI`.trim()}
      />
      <YStack br="$2" m="$2" bc="$blue3" minHeight={500} ai="center" jc="center">
        <Component />
      </YStack>
    </>
  )
}
