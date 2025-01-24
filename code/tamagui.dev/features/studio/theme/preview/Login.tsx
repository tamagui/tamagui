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
          bbw="$0"
        >
          <H4 size="$4" {...demoProps.headingFontFamilyProps} ta="center">
            Welcome Back!
          </H4>
          <Paragraph ta="center" {...demoProps.panelDescriptionProps} o={0.5} size="$2">
            Connect your git provider
          </Paragraph>
        </YStack>

        <YStack flex={1} {...demoProps.gapPropsLg}>
          <XStack {...demoProps.gapPropsMd}>
            <>
              <Button
                f={1}
                fb={0}
                size="$3"
                icon={IconGitlab}
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
              >
                GitLab
              </Button>
              <Button
                f={1}
                fb={0}
                size="$3"
                icon={IconGithub}
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
              >
                GitHub
              </Button>
            </>
          </XStack>

          <XStack my="$2" w="100%">
            <XStack pos="absolute" l={0} r={0} ai="center" gap="$4">
              <Separator f={1} />
              <SizableText fontFamily="$heading" ta="center" theme="alt2" size="$1">
                or continue with
              </SizableText>
              <Separator f={1} />
            </XStack>
          </XStack>

          <Spacer size="$1" />

          <YStack {...demoProps.gapPropsMd}>
            <Fieldset gap="$1">
              <Label>Username</Label>
              <Input
                placeholder="Username"
                {...demoProps.borderRadiusProps}
                backgroundColor="transparent"
              />
            </Fieldset>

            <Spacer size="$2" />

            <Fieldset gap="$1">
              <Label>Password</Label>
              <Input
                placeholder="Password"
                secureTextEntry
                backgroundColor="transparent"
                {...demoProps.borderRadiusProps}
              />
            </Fieldset>
          </YStack>
        </YStack>

        <YStack mt="$4">
          <Theme name="accent">
            <Button
              fontWeight="600"
              size="$5"
              {...demoProps.borderRadiusProps}
              {...demoProps.buttonOutlineProps}
            >
              Login
            </Button>
          </Theme>
        </YStack>
      </Form>
    </YStack>
  )
}
