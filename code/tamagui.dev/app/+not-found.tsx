import { LogoIcon } from '@tamagui/logo/types'
import { Container } from '../components/Containers'
import { H1, YStack } from 'tamagui'

export default () => {
  return (
    <Container>
      <YStack items="center" self="center" py="$10" justify="center">
        <H1>404 O_O</H1>
        <LogoIcon downscale={0.5} />
      </YStack>
    </Container>
  )
}
