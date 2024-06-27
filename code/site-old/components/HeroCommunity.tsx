import { EnsureFlexed, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { SocialLinksRow } from './SocialLinksRow'

export function Community() {
  return (
    <ContainerLarge mt="$-8" mb="$6" space="$6">
      <YStack maxWidth="100%" fs={0} als="center">
        <EnsureFlexed />
        <SocialLinksRow />
      </YStack>
    </ContainerLarge>
  )
}
