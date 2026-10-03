import { YStack } from 'tamagui'

import * as Layouts from '@tamagui/bento/component/forms/layouts'

import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

type Props = ReturnType<typeof layoutsGetComponentCodes>

export function layouts() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
      marginHorizontal="@sm/window:1-5"
    >
      <Showcase fileName={Layouts.SignInScreen.fileName} title="Sign-in Form">
        <Wrapper>
          <Layouts.SignInScreen />
        </Wrapper>
      </Showcase>
      <Showcase fileName={Layouts.SignInRightImage.fileName} title="Sign-in Right Image">
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
