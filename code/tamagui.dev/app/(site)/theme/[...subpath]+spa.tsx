import { usePathname } from 'one'
import { Paragraph, YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { freeThemes } from '~/features/docs/freeThemes'
import { ThemePageUpdater } from '~/features/studio/theme/ThemePage'

export default function SharedThemePage() {
  const pathname = usePathname()
  const themeId = pathname.split('/')[2]
  const theme = freeThemes.find((option) => String(option.id) === themeId)

  if (!theme) {
    return (
      <>
        <HeadInfo title="Theme not found — Tamagui" />
        <YStack mx="auto" width="100%" maxW={640} px="4" py="14" gap="4">
          <Paragraph size="6">This shared theme is no longer available.</Paragraph>
          <Link href="/theme">Open the Theme Builder</Link>
        </YStack>
      </>
    )
  }

  return (
    <>
      <HeadInfo
        title={`${theme.searchQuery || 'Tamagui Theme Builder'} — Tamagui Theme`}
        description={
          theme.searchQuery
            ? `Tamagui Theme for ${theme.searchQuery}`
            : 'Tamagui Theme Builder'
        }
      />
      <ThemePageUpdater
        id={theme.id}
        search={theme.searchQuery}
        theme={theme.themeData}
        user_name={null}
      />
    </>
  )
}
