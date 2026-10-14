import { ThemeTintAlt } from '@tamagui/logo'
import { XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { SubTitle } from '~/components/SubTitle'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { InstallInput } from '~/features/site/home/InstallInput'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'

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

      <YStack
        items="center"
        justify="center"
        gap="11"
        px="4"
        py="14"
        minH="80vh"
        minW="850px max-md:90%"
        maxW={850}
        self="center"
      >
        <TakeoutLogo />

        <SubTitle
          size="8"
          text="center"
          fontSize="max-md:6"
          lineHeight="max-md:6"
          maxW={640}
        >
          Free and open source React Native starter kit.
        </SubTitle>

        <YStack mt="-6" gap="5" items="center">
          <InstallInput command="npx one" prompt={false} />
          <XStack gap="4" items="center" justify="center" flexWrap="wrap">
            <Link href="https://takeout.tamagui.dev" target="_blank">
              <Button size="lg" variant="outlined">
                <Button.Text>Demo</Button.Text>
              </Button>
            </Link>

            <Link href="https://github.com/tamagui/takeout2" target="_blank">
              <Button size="lg">
                <Button.Text>Repo</Button.Text>
              </Button>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </>
  )
}
