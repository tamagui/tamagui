import { LinearGradient } from '@tamagui/linear-gradient'
import { Facebook, Github } from '../../icons'
import { useId, useState } from 'react'
import {
  Anchor,
  AnimatePresence,
  Button,
  H1,
  Image,
  Paragraph,
  Separator,
  Spinner,
  Text,
  View,
} from 'tamagui'

import { Input } from '../inputs/components/inputsParts'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Hide } from './components/layoutParts'

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
export function SignInRightImage() {
  const uniqueId = useId()
  const { signIn, status } = useSignIn()
  const { 'max-sm': narrow } = useGroupMedia('window')
  return (
    <View flexDirection="row" minW="100%" height="100%" items="stretch">
      <View
        flexDirection="column"
        justify="center"
        items="stretch"
        flexBasis={0}
        grow={1}
        shrink={1}
        gap="6"
        mx="auto"
        px="@sm/window:12"
        maxW="@sm/window:600px"
        py="@sm/window:8"
      >
        <H1 self="center" size={narrow ? '7' : '8'}>
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="3" minW="100%">
          <View flexDirection="column" gap="1">
            <Input minW="100%">
              <Input.Label htmlFor={uniqueId + 'email'}>Email</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + 'email'} placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="1">
            <Input>
              <View flexDirection="row" items="center" justify="space-between">
                <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
              </View>
              <Input.Box>
                <Input.Area
                  secureTextEntry
                  id={uniqueId + 'password'}
                  placeholder="Enter password"
                />
              </Input.Box>
              <ForgotPasswordLink />
            </Input>
          </View>

          <Button
            theme="accent"
            disabled={status === 'loading'}
            onPress={signIn}
            width="100%"
            mb={0}
            iconAfter={
              <AnimatePresence>
                {status === 'loading' && (
                  <Spinner
                    color="color"
                    opacity="1 enter:0 exit:0"
                    scale="1 enter:0.5 exit:0.5"
                    position="absolute"
                    l="70% @sm/window:60%"
                    transition="quick"
                    key="loading-spinner"
                  />
                )}
              </AnimatePresence>
            }
          >
            Continue
          </Button>

          <View flexDirection="column" gap="3" width="100%" self="center" items="center">
            <View flexDirection="row" width="100%" items="center" gap="4">
              <Separator />
              <Paragraph>Or</Paragraph>
              <Separator />
            </View>
            <View flexDirection="row" flexWrap="wrap" gap="3">
              <Button theme="accent" minW="100%">
                <Button.Icon>
                  <Github color="color-9" size="1" />
                </Button.Icon>
                <Button.Text>Continue with Github</Button.Text>
              </Button>
              <Button theme="accent" minW="100%">
                <Button.Icon>
                  <Facebook color="blue-10" size="1" />
                </Button.Icon>
                <Button.Text>Continue with Facebook</Button.Text>
              </Button>
            </View>
          </View>
        </View>
        <SignUpLink />
      </View>
      <Hide when="max-md">
        <View position="relative" flexBasis={0} grow={1.5} shrink={1} overflow="hidden">
          <LinearGradient
            colors={['blue-9', 'purple-9']}
            opacity={0.15}
            start={[0, 1]}
            end={[0, 0]}
            position="absolute"
            inset={0}
            z={5}
          />
          <Image
            width="100%"
            height="100%"
            objectFit="cover"
            src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&width=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </View>
      </Hide>
    </View>
  )
}

SignInRightImage.fileName = 'SignInRightImage'

const SignUpLink = () => {
  return (
    <Anchor self="center" href={`#`}>
      <Paragraph text="center">
        Don&apos;t have an account?{' '}
        <Text color="hover:color-hover" textDecorationLine="underline">
          Sign up
        </Text>
      </Paragraph>
    </Anchor>
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
