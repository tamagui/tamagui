import { TamaguiLogo } from '@tamagui/logo'
import { H1, Paragraph, Square, XStack, YStack } from 'tamagui'

import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { useThemeBuilderStore } from '../store/ThemeBuilderStore'

export const Header = () => {
  const demoProps = useDemoProps()
  const store = useThemeBuilderStore()

  return (
    <XStack mt={-20} maxW="100%" gap="$6" flex={1} justify="space-between" items="center">
      <YStack flex={1} maxW={700} gap="$5">
        <H1 mb="-2%" {...demoProps.headingFontFamilyProps} size="$12" lineHeight="$11">
          {store.themeSuite?.name || 'Design System'}
        </H1>
      </YStack>

      <YStack>
        <Square
          size="$9"
          mx="$2"
          bg="$backgroundFocus"
          borderColor="$color5"
          {...demoProps.borderRadiusOuterProps}
          $lg={{
            width: '100%',
            maxW: '100%',
          }}
          $group-content-sm={{
            display: 'none',
            bg: 'red',
          }}
        >
          <TamaguiLogo scale={1.5} />
        </Square>
      </YStack>
    </XStack>
  )
}
