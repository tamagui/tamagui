import { Configuration, useConfiguration } from '@tamagui/web'
import { YStack } from 'tamagui'
import { animations } from '../../packages/tamagui-dev-config/src/animations.motion'

export default function Sandbox() {
  return (
    <Configuration animationDriver={animations}>
      <YStack p="$10" items="center" justify="center">
        <SandboxContent />
        {/* <LogoWords animated /> */}
      </YStack>
    </Configuration>
  )
}

function SandboxContent() {
  const config = useConfiguration()
  console.warn('render', config)

  return null
}
