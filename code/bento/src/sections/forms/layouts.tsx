import { YStack } from 'tamagui'

import * as Layouts from '../../components/forms/layouts'

import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

type Props = ReturnType<typeof layoutsGetComponentCodes>

export function layouts(props: Props) {
  return (
    <YStack
      pb="$10"
      gap="$12"
      padding="$2"
      $gtLg={{ padding: '$0' }}
      $group-window-sm={{ marginHorizontal: '$2' }}
    >
      <Showcase fileName={Layouts.SignInScreen.fileName} title="Sign-in Form">
        <Wrapper>
          <Layouts.SignInScreen />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Layouts.SignInRightImage.fileName} title="Sign-in Right Image">
        <Wrapper marginVertical={-24} p={0}>
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
