import { useParams } from 'one'
import { H1, YStack } from 'tamagui'
// import { AllBento } from '~/components/allComponents'

export function generateStaticParams() {
  return [{ slug: 'a' }]
}

export function BentoPage() {
  return null
  // const params = useParams<any>()
  // const Component = AllBento[params.slug]

  // if (!Component) {
  //   return <H1>No Bento!</H1>
  // }

  // return (
  //   <YStack bg="$color2" f={1}>
  //     <Component />
  //   </YStack>
  // )
}
