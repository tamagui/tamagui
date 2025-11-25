import { EnsureFlexed, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { SocialLinksRow } from './SocialLinksRow'

export function HomeCommunity() {
  return (
    <ContainerLarge mt="$-8" mb="$6" gap="$6">
      <YStack maxW="100%" shrink={0} self="center">
        <EnsureFlexed />
        <SocialLinksRow />
      </YStack>
    </ContainerLarge>
  )
}
