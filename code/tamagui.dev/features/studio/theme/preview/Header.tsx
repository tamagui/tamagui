import { TamaguiLogo } from '@tamagui/logo'
import { H1, Paragraph, Square, XStack, YStack } from 'tamagui'

import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { useThemeBuilderStore } from '../store/ThemeBuilderStore'

export const Header = () => {
  const demoProps = useDemoProps()
  const store = useThemeBuilderStore()

  return (
    <XStack mt={-20} maxW="100%" gap="6" flex={1} justify="space-between" items="center">
      <YStack flex={1} flexBasis="auto" maxW={700} gap="5">
        <H1 mb="-2%" {...demoProps.headingFontFamilyProps} lineHeight="11" size="12">
          {store.themeSuite?.name || 'Design System'}
        </H1>
      </YStack>

      <YStack>
        <Square
          size="9"
          mx="2"
          bg="background-focus @sm/content:red"
          borderColor="color5"
          {...demoProps.borderRadiusOuterProps}
          width="lg:100%"
          maxW="lg:100%"
          display="@sm/content:none"
        >
          <TamaguiLogo scale={1.5} />
        </Square>
      </YStack>
    </XStack>
  )
}
