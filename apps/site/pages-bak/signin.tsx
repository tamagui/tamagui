import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { useUser } from '@supabase/supabase-auth-helpers/react'
import { Provider } from '@supabase/supabase-js'
import { LogoIcon } from '@tamagui/logo'
import Link from 'next/link'
import React from 'react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Input, Paragraph, Separator, XStack, YStack } from 'tamagui'

import { GithubIcon } from '../components/GithubIcon'
import { Notice } from '../components/Notice'
import { useForwardToDashboard } from '../hooks/useForwardToDashboard'
import { getUserLayout } from '../lib/getUserLayout'
import { getURL } from '../lib/helpers'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: '',
  })
  const { user } = useUser()
  const emailRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    emailRef.current?.focus()
  }, [])

  useForwardToDashboard()

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setMessage({})

    const { error } = await supabaseClient.auth.signIn(
      { email, password },
      { redirectTo: getURL() }
    )
    if (error) {
      setMessage({ type: 'error', content: error.message })
    }
    if (!password) {
      setMessage({
        type: 'note',
        content: 'Check your email for the magic link.',
      })
    }
    setLoading(false)
  }

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signIn({ provider })
    if (error) {
      setMessage({ type: 'error', content: error.message })
    }
    setLoading(false)
  }

  if (!user)
    return (
      <YStack mih="100vh" miw="100vw" ai="center" jc="center" p="$2">
        <YStack miw={300} maw={320} jc="space-between" p="$2" space="$4">
          <Link href="/takeout/purchase" passHref>
            <YStack tag="a" mb="$4">
              <LogoIcon />
            </YStack>
          </Link>

          {message.content && (
            <Notice
              className={`${message.type === 'error' ? 'text-pink-500' : 'text-green-500'} border ${
                message.type === 'error' ? 'border-pink-500' : 'border-green-500'
              } p-3`}
            >
              <Paragraph>{message.content}</Paragraph>
            </Notice>
          )}

          {!showPasswordInput && (
            <form onSubmit={handleSignin}>
              <YStack space="$2">
                <Input
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  // @ts-ignore
                  onSubmitEditing={handleSignin}
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  ref={emailRef}
                />
                <Button
                  // @ts-expect-error
                  type="submit"
                  loading={loading}
                  disabled={!email.length}
                >
                  Send magic link
                </Button>
              </YStack>
            </form>
          )}

          {showPasswordInput && (
            <form onSubmit={handleSignin}>
              <YStack space="$2">
                <Input
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Input
                  autoComplete="password"
                  secureTextEntry
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.nativeEvent.text)}
                  // @ts-ignore
                  required
                />
                <Button
                  // @ts-ignore
                  type="submit"
                  loading={loading}
                  disabled={!password.length || !email.length}
                >
                  Sign in
                </Button>
              </YStack>
            </form>
          )}

          <YStack space="$2">
            <Paragraph
              ta="center"
              size="$2"
              cursor="pointer"
              href="#"
              className="text-zinc-200 text-accent-9 hover:underline cursor-pointer"
              onPress={() => {
                if (showPasswordInput) setPassword('')
                setShowPasswordInput(!showPasswordInput)
                setMessage({})
              }}
            >
              <a>Or sign in with {showPasswordInput ? 'magic link' : 'password'}</a>.
            </Paragraph>

            <Paragraph theme="alt2" ta="center" size="$2">
              Don't have an account?
              {` `}
              <Link href="/signup">
                <a style={{ fontWeight: '800' }}>Sign up.</a>
              </Link>
            </Paragraph>
          </YStack>

          <XStack mx="$4" jc="center" space ai="center">
            <Separator />
            <Paragraph size="$2">Or</Paragraph>
            <Separator />
          </XStack>

          <Button
            // @ts-ignore
            type="submit"
            disabled={loading}
            onClick={() => handleOAuthSignIn('github')}
            size="$4"
            icon={GithubIcon}
          >
            Continue with GitHub
          </Button>
        </YStack>
      </YStack>
    )

  return <div className="m-6">...</div>
}

SignInPage.getLayout = getUserLayout
