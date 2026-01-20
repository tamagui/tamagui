import {
  Button,
  Fieldset,
  Form,
  H4,
  Input,
  Label,
  Paragraph,
  Separator,
  SizableText,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { IconGithub } from '~/features/studio/theme/icons/icon-github'
import { IconGitlab } from '~/features/studio/theme/icons/icon-gitlab'
import { ButtonSimple } from './ButtonSimple'

export const LoginScreen = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <Form>
        <YStack
          borderBottomWidth="$0.25"
          borderBottomColor="$borderColor"
          pb="$4"
          gap="$3"
        >
          <H4 {...demoProps.headingFontFamilyProps} text="center">
            Welcome Back!
          </H4>
          <Paragraph
            text="center"
            {...demoProps.panelDescriptionProps}
            opacity={0.5}
            size="$2"
          >
            Connect your git provider
          </Paragraph>
        </YStack>

        <YStack flex={1} flexBasis="auto" {...demoProps.gapPropsLg}>
          <XStack {...demoProps.gapPropsMd}>
            <>
              <ButtonSimple
                flex={1}
                size="$3"
                icon={IconGitlab}
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
              >
                GitLab
              </ButtonSimple>
              <ButtonSimple
                flex={1}
                size="$3"
                icon={IconGithub}
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
              >
                GitHub
              </ButtonSimple>
            </>
          </XStack>

          <XStack my="$2" width="100%">
            <XStack position="absolute" l={0} r={0} items="center" gap="$4">
              <Separator flex={1} />
              <SizableText fontFamily="$heading" text="center" theme="alt2" size="$1">
                or continue with
              </SizableText>
              <Separator flex={1} />
            </XStack>
          </XStack>

          <Spacer size="$1" />

          <YStack {...demoProps.gapPropsMd}>
            <Fieldset gap="$1">
              <Label>Username</Label>
              <Input
                placeholder="Username"
                {...demoProps.borderRadiusProps}
                bg="transparent"
              />
            </Fieldset>

            <Spacer size="$2" />

            <Fieldset gap="$1">
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                bg="transparent"
                {...demoProps.borderRadiusProps}
              />
            </Fieldset>
          </YStack>
        </YStack>

        <YStack mt="$4">
          <Theme name="accent">
            <Button
              size="$5"
              {...demoProps.borderRadiusProps}
              {...demoProps.buttonOutlineProps}
            >
              <SizableText fontWeight="600">Login</SizableText>
            </Button>
          </Theme>
        </YStack>
      </Form>
    </YStack>
  )
}
