import { getDefaultLayout } from '@lib/getDefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { H2, YStack } from 'tamagui'

export default function Custom404() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
      <AlertTriangle size="$7" />
      <H2>404 - Page Not Found</H2>
    </YStack>
  )
}

Custom404.getLayout = getDefaultLayout
