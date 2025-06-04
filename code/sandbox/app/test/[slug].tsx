import { useParams } from 'one'
import { H1, YStack } from 'tamagui'
import { AllTests } from '~/components/allComponents'

export function generateStaticParams() {
  return [{ slug: 'a' }]
}

export function TestPage() {
  const params = useParams<any>()
  const Component = AllTests[params.slug]

  if (!Component) {
    return <H1>No Test!</H1>
  }

  return (
    <YStack f={1}>
      <Component />
    </YStack>
  )
}
