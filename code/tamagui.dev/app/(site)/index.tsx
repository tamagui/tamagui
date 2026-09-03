import { TamaguiIconSvg } from '@tamagui/logo'
import { H1, Paragraph, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { InstallInput } from '~/features/site/home/InstallInput'

export default function TamaguiHomePage() {
  return (
    <>
      <HeadInfo
        title="Tamagui"
        description="Type-safe styles for React and React Native, with an optimizing compiler and Tailwind compatibility."
      />

      <YStack items="center" gap="8" px="4" pt="12" pb="10" mx="auto" maxW={720}>
        <TamaguiIconSvg width={160} height={160} />

        <YStack items="center" gap="5" maxW={620}>
          <H1 size="10" text="center" letterSpacing={-1}>
            Type-safe styles for React and React&nbsp;Native
          </H1>

          <Paragraph size="6" text="center" color="color11">
            An optimizing compiler flattens your components and extracts them to atomic
            CSS. In v3, Tamagui also speaks Tailwind, with the highest coverage of any
            cross-platform style library.
          </Paragraph>
        </YStack>

        <InstallInput />

        <XStack gap="3" items="center" flexWrap="wrap" justify="center">
          <Link asChild href="/docs/intro/introduction">
            <Button size="5" rounded={1000} aria-label="Get started (docs)">
              <Button.Text>Get started</Button.Text>
            </Button>
          </Link>

          <Link asChild target="_blank" href="https://github.com/tamagui/tamagui">
            <Button size="5" rounded={1000} variant="outlined" aria-label="GitHub">
              <GithubIcon width={18} />
              <Button.Text>GitHub</Button.Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </>
  )
}
