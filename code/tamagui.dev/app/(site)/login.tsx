import type { Provider } from '@supabase/auth-js'
import { LogoIcon } from '@tamagui/logo'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button, Input, Paragraph, Separator, Spinner, XStack, YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { Notice } from '~/components/Notice'
import { useSupabase } from '~/features/auth/useSupabaseClient'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { useForwardToDashboard } from '~/features/user/useForwardToDashboard'
import { useUser } from '~/features/user/useUser'

const isProd = process.env.NODE_ENV === 'production'
const emailAuthDisabledFlag = isProd

export default function SignInPage() {
  return (
    <>
      <HeadInfo title="Login" />
      <SignIn />
    </>
  )
}

function SignIn() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: '',
  })
  const { data } = useUser()
  const user = data?.user
  const emailRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    emailRef.current?.focus()
  }, [])

  useForwardToDashboard()

  // auto-trigger GitHub OAuth when opened as a popup (from checkout flow)
  // must be before any early returns to avoid hooks ordering violation (react error 310)
  useEffect(() => {
    if (supabase && !user && window.opener && window.opener !== window) {
      const redirectTo = `${window.location.origin}/api/auth/callback`
      supabase.auth
        .signInWithOAuth({
          provider: 'github',
          options: { redirectTo },
        })
        .then(({ data, error }) => {
          if (!error && data?.url) {
            window.location.href = data.url
          }
        })
    }
  }, [supabase, user])

  if (!supabase) {
    return (
      <YStack flex={1} flexBasis="auto" items="center" justify="center">
        <Spinner size="small" />
      </YStack>
    )
  }

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setMessage({})

    try {
      if (showPasswordInput) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        })
        if (error) throw error
        setMessage({
          type: 'note',
          content: 'Check your email for the magic link.',
        })
      }
    } catch (error) {
      setMessage({ type: 'error', content: `${error}` })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: Provider) => {
    const redirectTo = `${window.location.origin}/api/auth/callback`
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      setMessage({ type: 'error', content: error.message })
      setLoading(false)
      return
    }

    // AuthClient doesn't auto-redirect, we need to do it manually
    if (data?.url) {
      window.location.href = data.url
    }
  }

  if (!user)
    return (
      <YStack
        flex={1}
        minH="100vh"
        items="center"
        justify="center"
        p="$2"
        bg="$background"
      >
        <YStack
          minW={300}
          maxW={320}
          justify="space-between"
          p="$2"
          gap="$4"
          items="center"
        >
          <YStack mb="$4">
            <LogoIcon />
          </YStack>

          {Boolean(message.content) && (
            <Notice>
              <Paragraph>{message.content}</Paragraph>
            </Notice>
          )}

          <Button
            // @ts-ignore
            type="submit"
            disabled={loading}
            onClick={() => handleOAuthSignIn('github')}
            size="$4"
            icon={loading ? <Spinner size="small" /> : GithubIcon}
            opacity={loading ? 0.5 : 1}
          >
            {loading ? 'Redirecting...' : 'Continue with GitHub'}
          </Button>

          {!emailAuthDisabledFlag && (
            <>
              <XStack mx="$4" justify="center" gap="$4" items="center">
                <Separator />
                <Paragraph size="$2">Or</Paragraph>
                <Separator />
              </XStack>
              <YStack>
                {!showPasswordInput && (
                  <form onSubmit={handleSignin}>
                    <YStack gap="$3">
                      <Input
                        autoComplete="email"
                        inputMode="email"
                        placeholder="Email"
                        // @ts-ignore
                        onSubmitEditing={handleSignin}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ref={emailRef}
                        disabled={emailAuthDisabledFlag}
                      />
                      <Button
                        icon={loading ? <Spinner size="small" /> : null}
                        disabled={!email.length || emailAuthDisabledFlag}
                      >
                        Send magic link
                      </Button>
                    </YStack>
                  </form>
                )}

                {showPasswordInput && (
                  <form onSubmit={handleSignin}>
                    <YStack gap="$2">
                      <Input
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={emailAuthDisabledFlag}
                      />
                      <Input
                        autoComplete="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={emailAuthDisabledFlag}
                      />
                      <Button
                        type="submit"
                        disabled={
                          !password.length || !email.length || emailAuthDisabledFlag
                        }
                      >
                        Sign in
                      </Button>
                    </YStack>
                  </form>
                )}

                {emailAuthDisabledFlag && (
                  <YStack
                    position="absolute"
                    l={-5}
                    r={-5}
                    t={-5}
                    b={-5}
                    items="center"
                    justify="center"
                    rounded="$4"
                  >
                    <Paragraph text="center" mt="$2" color="$color9">
                      Email auth is disabled at the moment.
                    </Paragraph>
                  </YStack>
                )}
              </YStack>
            </>
          )}
          {/* <YStack gap="$2" >
            <Paragraph
              render="button"
              ta="center"
              size="$2"
              cursor="pointer"
              className="text-zinc-200 text-accent-9 hover:underline cursor-pointer"
              onPress={() => {
                if (showPasswordInput) setPassword('')
                setShowPasswordInput(!showPasswordInput)
                setMessage({})
              }}
            >
              Or sign in with {showPasswordInput ? 'magic link' : 'password'}
            </Paragraph>

            <Paragraph color="$color9" ta="center" size="$2">
              Don't have an account?
              {` `}
              <Link href="/signup" style={{ fontWeight: '800' }}>
                Sign up.
              </Link>
            </Paragraph> 
          </YStack> */}
        </YStack>
      </YStack>
    )

  return (
    <YStack
      z={10000000}
      bg="$background"
      justify="center"
      position="absolute"
      fullscreen
      items="center"
    >
      <Spinner size="small" />
    </YStack>
  )
}
