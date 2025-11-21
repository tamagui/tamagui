import { YStack } from 'tamagui'

import * as Layouts from '@tamagui/bento/component/forms/layouts'

import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

type Props = ReturnType<typeof layoutsGetComponentCodes> & BentoShowcaseContext

export function layouts({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack
        pb="$10"
        gap="$12"
        p="$2"
        $gtLg={{ p: '$0' }}
        $group-window-sm={{ marginHorizontal: '$2' }}
      >
        <Showcase unlock fileName={Layouts.SignInScreen.fileName} title="Sign-in Form">
          <Wrapper>
            <Layouts.SignInScreen />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Layouts.SignInRightImage.fileName}
          title="Sign-in Right Image"
        >
          <Wrapper my={-24} p={0}>
            <Layouts.SignInRightImage />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Layouts.SignUpScreen.fileName} title="Sign-up Form">
          <Wrapper>
            <Layouts.SignUpScreen />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Layouts.SignUpTwoSideScreen.fileName}
          title="Sign-up Form - Two Column"
        >
          <Wrapper p={0}>
            <Layouts.SignUpTwoSideScreen />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Layouts.ShortEmailPassword.fileName}
          title="Short Email Password Layout"
        >
          <Layouts.ShortEmailPassword />
        </Showcase>
        <Showcase
          fileName={Layouts.SignupValidatedHookForm.fileName}
          title="Integrated with react-hook-form and Zod"
        >
          <Wrapper>
            <Layouts.SignupValidatedHookForm />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Layouts.SignupValidatedTsForm.fileName}
          title="Integrated with react-ts-form and Zod"
        >
          <Wrapper>
            <Layouts.SignupValidatedTsForm />
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

export function layoutsGetComponentCodes() {
  return {
    codes: {
      SignInScreen: '',
      SignInRightImage: '',
      SignUpScreen: '',
      SignUpTwoSideScreen: '',
    },
  }
}
