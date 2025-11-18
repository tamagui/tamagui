import { YStack } from 'tamagui'

// import * as Preferences from '@tamagui/bento/component/user/preferences'
// import {
//   Showcase,
//   ShowcaseChildWrapper as Wrapper,
// } from '~/components/bento-showcase/_Showcase'
import { BentoShowcaseProvider } from '~/components/bento-showcase/BentoProvider'
// import { UserProfile } from '../../components'

type Props = {
  isProUser: boolean
  showAppropriateModal: () => void
}

export function profile({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        {/* <Showcase
          unlock={true}
          fileName={Preferences.Profile.fileName}
          title="Profile"
        >
          <Wrapper p={0}>
            <UserProfile.ProfileView />
          </Wrapper>
        </Showcase> */}
      </YStack>
    </BentoShowcaseProvider>
  )
}
