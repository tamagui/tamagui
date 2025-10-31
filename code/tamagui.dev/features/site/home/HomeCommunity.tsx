import { EnsureFlexed, YStack } from '@tamagui/ui'

import { ContainerLarge } from '~/components/Containers'
import { SocialLinksRow } from './SocialLinksRow'

export function HomeCommunity() {
  return (
    <ContainerLarge mt="$-8" mb="$6" gap="$6">
      <YStack maxWidth="100%" fs={0} als="center">
        <EnsureFlexed />
        <SocialLinksRow />
      </YStack>
    </ContainerLarge>
  )
}
