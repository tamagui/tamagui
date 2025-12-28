import type { ComponentType } from 'react'
import { useParams } from 'one'
import { YStack, H2, Theme, Paragraph } from 'tamagui'
import * as Demos from '~/features/docs/demos'

// Type for demo components (exclude lazyDemo helper function)
type DemoExports = {
  [K in keyof typeof Demos]: (typeof Demos)[K] extends () => React.ReactNode ? K : never
}[keyof typeof Demos]

// Get all demo names for static generation (exclude lazyDemo helper)
const demoNames = Object.keys(Demos)
  .filter((key) => key.endsWith('Demo') && key !== 'lazyDemo')
  .map((key) => key.replace(/Demo$/, '').toLowerCase())

export function generateStaticParams() {
  return demoNames.map((name) => ({ name }))
}

export default function DemoPage() {
  const params = useParams<{ name: string }>()
  const demoName = params.name

  if (!demoName) {
    return (
      <Theme name="light">
        <YStack flex={1} items="center" justify="center" p="$6" bg="$background">
          <H2>No demo specified</H2>
          <Paragraph theme="alt1" mt="$2">
            Try /demo/Menu or /demo/Button
          </Paragraph>
        </YStack>
      </Theme>
    )
  }

  // Capitalize first letter and add "Demo" suffix
  const componentName =
    `${demoName.charAt(0).toUpperCase()}${demoName.slice(1)}Demo` as DemoExports
  const DemoComponent = Demos[componentName] as ComponentType

  if (!DemoComponent) {
    return (
      <Theme name="light">
        <YStack flex={1} items="center" justify="center" p="$6" bg="$background">
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
      <YStack
        flex={1}
        items="center"
        justify="center"
        p="$6"
        bg="$background"
        minH="100vh"
      >
        <YStack width="100%" maxW={1200}>
          <H2 mb="$4">{componentName}</H2>
          <DemoComponent />
        </YStack>
      </YStack>
    </Theme>
  )
}
