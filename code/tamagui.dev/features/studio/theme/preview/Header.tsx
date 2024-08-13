import { TamaguiLogo } from '@tamagui/logo'
import { H1, Paragraph, Square, XStack, YStack } from 'tamagui'

import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { useThemeBuilderStore } from '../store/ThemeBuilderStore'

export const Header = () => {
  const demoProps = useDemoProps()
  const store = useThemeBuilderStore()

  return (
    <XStack maw="100%" gap="$6" f={1} jc="space-between" ai="center">
      <YStack f={1} maw={700} gap="$5">
        <H1 mb="-2%" {...demoProps.headingFontFamilyProps} size="$12" lh="$11">
          {store.themeSuite?.name || 'Design System'}
        </H1>
        <Paragraph size="$5" col="$color9">
          Note that the styles used below are just for example, you can customize the
          theme or components after you copy/paste to your taste.
        </Paragraph>
      </YStack>

      <YStack>
        <Square
          size="$9"
          mx="$2"
          bg="$backgroundFocus"
          bc="$color5"
          {...demoProps.borderRadiusOuterProps}
          $lg={{
            width: '100%',
            maxWidth: '100%',
          }}
          $group-content-sm={{
            dsp: 'none',
            bg: 'red',
          }}
        >
          <TamaguiLogo scale={1.5} />
        </Square>
      </YStack>
    </XStack>
  )
}
