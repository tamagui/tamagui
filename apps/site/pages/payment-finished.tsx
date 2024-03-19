import { getDefaultLayout } from '@lib/getDefaultLayout'
import { withSupabase } from '@lib/withSupabase'
import { UserGuard } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner, YStack } from 'tamagui'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // take some time for stripe to hit our webhook
    const id = setTimeout(() => {
      router.replace('/account/items')
    }, 5_000)
    return () => {
      clearTimeout(id)
    }
  }, [router.replace])

  return (
    <>
      <NextSeo title="Account — Tamagui" description="A better universal UI system." />

      <UserGuard>
        <YStack ai="center" flex={1} jc="center">
          <Spinner size="large" />
        </YStack>
      </UserGuard>
    </>
  )
}

Page.getLayout = (page, pageProps, path) =>
  withSupabase(getDefaultLayout(page, pageProps, path), pageProps)
