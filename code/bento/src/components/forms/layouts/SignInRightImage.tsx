import { LinearGradient } from '@tamagui/linear-gradient'
import { Facebook, Github } from '@tamagui/lucide-icons'
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
  Theme,
  View,
} from 'tamagui'

import { Input } from '../inputs/components/inputsParts'
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
  return (
    <View flexDirection="row" minWidth="100%" height="100%" alignItems="stretch">
      <View
        flexDirection="column"
        justifyContent="center"
        alignItems="stretch"
        flexBasis={0}
        flexGrow={1}
        flexShrink={1}
        gap="$6"
        marginHorizontal="auto"
        $group-window-gtXs={{
          paddingHorizontal: '$12',
          maxWidth: 600,
          paddingVertical: '$8',
        }}
      >
        <H1
          alignSelf="center"
          size="$8"
          $group-window-xs={{
            size: '$7',
          }}
        >
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="$3" minWidth="100%">
          <View flexDirection="column" gap="$1">
            <Input size="$4" minWidth="100%">
              <Input.Label htmlFor={uniqueId + 'email'}>Email</Input.Label>
              <Input.Box>
                <Input.Area id={uniqueId + 'email'} placeholder="email@example.com" />
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Input.Label htmlFor={uniqueId + 'password'}>Password</Input.Label>
              </View>
              <Input.Box>
                <Input.Area
                  textContentType="password"
                  secureTextEntry
                  id={uniqueId + 'password'}
                  placeholder="Enter password"
                />
              </Input.Box>
              <ForgotPasswordLink />
            </Input>
          </View>
          <Theme inverse>
            <Button
              disabled={status === 'loading'}
              onPress={signIn}
              width="100%"
              mb={0}
              iconAfter={
                <AnimatePresence>
                  {status === 'loading' && (
                    <Spinner
                      color="$color"
                      key="loading-spinner"
                      opacity={1}
                      scale={1}
                      position="absolute"
                      left="70%"
                      $group-window-gtXs={{
                        left: '60%',
                      }}
                      animation="quick"
                      enterStyle={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      exitStyle={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                    />
                  )}
                </AnimatePresence>
              }
            >
              Continue
            </Button>
            <Theme inverse>
              <View
                flexDirection="column"
                gap="$3"
                width="100%"
                alignSelf="center"
                alignItems="center"
              >
                <View flexDirection="row" width="100%" alignItems="center" gap="$4">
                  <Separator />
                  <Paragraph>Or</Paragraph>
                  <Separator />
                </View>
                <View flexDirection="row" flexWrap="wrap" gap="$3">
                  <Button minWidth="100%">
                    <Button.Icon>
                      <Github color="$gray10" size="$1" />
                    </Button.Icon>
                    <Button.Text>Continue with Github</Button.Text>
                  </Button>
                  <Button minWidth="100%">
                    <Button.Icon>
                      <Facebook color="$blue10" size="$1" />
                    </Button.Icon>
                    <Button.Text>Continue with Facebook</Button.Text>
                  </Button>
                </View>
              </View>
            </Theme>
          </Theme>
        </View>
        <SignUpLink />
      </View>
      <Hide when="sm">
        <View flexBasis={0} flexGrow={1.5} flexShrink={1} overflow="hidden">
          <LinearGradient
            colors={['$red10', '$yellow10']}
            opacity={0.5}
            start={[0, 1]}
            end={[0, 0]}
            position="absolute"
            fullscreen
            zIndex={5}
          />
          <Image
            width="100%"
            height="100%"
            source={{
              uri: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&width=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
        </View>
      </Hide>
    </View>
  )
}

SignInRightImage.fileName = 'SignInRightImage'

const SignUpLink = () => {
  return (
    <Anchor alignSelf="center" href={`#`}>
      <Paragraph textAlign="center">
        Don&apos;t have an account?{' '}
        <Text
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </Text>
      </Paragraph>
    </Anchor>
  )
}

const ForgotPasswordLink = () => {
  return (
    <Anchor alignSelf="flex-end" href={`#`}>
      <Paragraph
        color="$gray11"
        hoverStyle={{
          color: '$gray12',
        }}
        size="$1"
        marginTop="$1"
      >
        Forgot your password?
      </Paragraph>
    </Anchor>
  )
}
