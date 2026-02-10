import * as Demos from '@tamagui/demos'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { Button, H1, YStack } from 'tamagui'

export function DemoScreen({
  demoName,
  onBack,
}: {
  demoName: string
  onBack: () => void
}) {
  const componentName = `${demoName}Demo`
  const DemoComponent = (Demos as any)[componentName] ?? NotFound

  return (
    <YStack flex={1} bg="$background">
      <YStack p="$3" pt="$6">
        <Button size="$3" icon={ArrowLeft} alignSelf="flex-start" onPress={onBack}>
          Back
        </Button>
      </YStack>

      <YStack flex={1} justify="center" items="center" gap="$4">
        <YStack minW={200} maxW={600} items="center" p="$10" rounded="$6">
          <DemoComponent />
        </YStack>
      </YStack>
    </YStack>
  )
}

const NotFound = () => <H1>Not found!</H1>
