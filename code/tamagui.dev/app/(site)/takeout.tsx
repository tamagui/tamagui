import { ThemeTintAlt } from '@tamagui/logo'
import { Suspense, lazy } from 'react'
import { XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { SubTitle } from '~/components/SubTitle'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'

const TakeoutBox3D = lazy(() => import('~/features/takeout/TakeoutBox3D'))

export default function TakeoutPage() {
  return (
    <>
      <HeadInfo
        title="Tamagui Takeout"
        description="A React Native and web starter kit built on Tamagui and One."
        openGraph={{
          url: '/takeout',
          images: [{ url: '/takeout/social.png' }],
        }}
      />

      <LoadCherryBomb />

      <YStack items="center" justify="center" gap="8" px="4" py="10" minH="80vh" minW="850px sm:90%" maxW={850} self="center" position="relative">
        <YStack
          position="absolute"
          pointerEvents="none"
          t="30% sm:25%"
          r="-20% md:-15% sm:-35%"
          width={450}
          height={450}
          scale="md:0.7 sm:0.6"
          z={100}
        >
          <Suspense fallback={null}>
            <ErrorBoundary noMessage>
              <TakeoutBox3D />
            </ErrorBoundary>
          </Suspense>
        </YStack>

        <TakeoutLogo />

        <SubTitle size="8" text="center" fontSize="sm:6" lineHeight="sm:6" maxW={640}>
          Free and open source React Native starter kit.
        </SubTitle>

        <XStack mt="-7" gap="4" items="center" justify="center" flexWrap="wrap">
          <Link href="https://takeout.tamagui.dev" target="_blank">
            <Button size="5" variant="outlined">
              <Button.Text>Demo</Button.Text>
            </Button>
          </Link>

          <Link href="https://github.com/tamagui/takeout" target="_blank">
            <Button size="5">
              <Button.Text>Repo</Button.Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </>
  )
}
