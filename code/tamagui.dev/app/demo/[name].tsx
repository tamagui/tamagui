import { useParams } from 'one'
import { YStack, H2, Theme, Paragraph } from 'tamagui'
import * as Demos from '~/features/docs/demos'

export default function DemoPage() {
  const params = useParams<{ name: string }>()
  const demoName = params.name

  if (!demoName) {
    return (
      <Theme name="light">
        <YStack f={1} ai="center" jc="center" p="$6" bg="$background">
          <H2>No demo specified</H2>
          <Paragraph theme="alt1" mt="$2">
            Try /demo/Menu or /demo/Button
          </Paragraph>
        </YStack>
      </Theme>
    )
  }

  // Capitalize first letter and add "Demo" suffix
  const componentName = `${demoName.charAt(0).toUpperCase()}${demoName.slice(1)}Demo` as keyof typeof Demos
  const DemoComponent = Demos[componentName]

  if (!DemoComponent) {
    return (
      <Theme name="light">
        <YStack f={1} ai="center" jc="center" p="$6" bg="$background">
          <H2>Demo not found</H2>
          <Paragraph theme="alt1" mt="$2">
            Could not find {componentName}
          </Paragraph>
          <Paragraph theme="alt2" mt="$2">
            Try /demo/Menu or /demo/Button
          </Paragraph>
        </YStack>
      </Theme>
    )
  }

  return (
    <Theme name="light">
      <YStack f={1} ai="center" jc="center" p="$6" bg="$background" minHeight="100vh">
        <YStack w="100%" maw={1200}>
          <H2 mb="$4">{componentName}</H2>
          <DemoComponent />
        </YStack>
      </YStack>
    </Theme>
  )
}
