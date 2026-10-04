import { Facebook, Github } from '../../icons'
import { useState } from 'react'
import {
  Anchor,
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  Theme,
  View,
} from 'tamagui'
import { Input } from '../inputs/components/inputsParts'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { FormCard } from './components/layoutParts'

/** simulate signin */
function useSignIn() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  return {
    status: status,
    signIn: () => {
      setStatus('loading')
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    },
  }
}

/** ------ EXAMPLE ------ */
export function SignInScreen() {
  const { signIn, status } = useSignIn()
  const { 'max-sm': narrow } = useGroupMedia('window')
  return (
    <FormCard>
      <View
        flexDirection="column"
        items="stretch"
        minW="100%"
        maxW="100%"
        gap="4"
        py="@md/window:4"
        width="@md/window:400px"
      >
        <H1 self="center" size={narrow ? '7' : '8'}>
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="3">
          <View flexDirection="column" gap="1">
            <Input>
              <Input.Label htmlFor="email">Email</Input.Label>
              <Input.Box>
                <Input.Area id="email" placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="1">
            <Input>
              <View flexDirection="row" items="center" justify="space-between">
                <Input.Label htmlFor={'password'}>Password</Input.Label>
              </View>
              <Input.Box>
                <Input.Area
                  secureTextEntry
                  id={'password'}
                  placeholder="Enter password"
                />
              </Input.Box>
              <ForgotPasswordLink />
            </Input>
          </View>
        </View>

        <Button
          theme="accent"
          disabled={status === 'loading'}
          onPress={signIn}
          width="100%"
          iconAfter={
            <AnimatePresence>
              {status === 'loading' && (
                <Spinner
                  color="color"
                  opacity="1 enter:0 exit:0"
                  scale="1 enter:0.5 exit:0.5"
                  transition="quick"
                  position="absolute"
                  l="60%"
                  key="loading-spinner"
                />
              )}
            </AnimatePresence>
          }
        >
          <Button.Text>Sign In</Button.Text>
        </Button>
        <View flexDirection="column" gap="3" width="100%" items="center">
          <Theme>
            <View
              flexDirection="column"
              gap="3"
              width="100%"
              self="center"
              items="center"
            >
              <View flexDirection="row" width="100%" items="center" gap="4">
                <Separator />
                <Paragraph>Or</Paragraph>
                <Separator />
              </View>
              <View flexDirection="row" flexWrap="wrap" gap="3">
                <Button flex={1} minW="100%">
                  <Button.Icon>
                    <Github color="color-9" size="1" />
                  </Button.Icon>
                  <Button.Text>Continue with Github</Button.Text>
                </Button>
                <Button flex={1}>
                  <Button.Icon>
                    <Facebook color="blue-10" size="1" />
                  </Button.Icon>
                  <Button.Text>Continue with Facebook</Button.Text>
                </Button>
              </View>
            </View>
          </Theme>
        </View>
        <SignUpLink />
      </View>
    </FormCard>
  )
}

SignInScreen.fileName = 'SignInScreen'

// Swap for your own Link
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return <Anchor href={href}>{children}</Anchor>
}

const SignUpLink = () => {
  return (
    <Link href={`#`}>
      <Paragraph textDecorationStyle="unset" text="center">
        Don&apos;t have an account?{' '}
        <SizableText color="hover:color-hover" textDecorationLine="underline">
          Sign up
        </SizableText>
      </Paragraph>
    </Link>
  )
}

const ForgotPasswordLink = () => {
  return (
    <Anchor self="flex-end" href={`#`}>
      <Paragraph color="color-10 hover:color-11" mt="1" size="1">
        Forgot your password?
      </Paragraph>
    </Anchor>
  )
}
