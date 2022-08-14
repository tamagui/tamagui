import { TamaguiLogo } from '@tamagui/logo'
import { Link } from '@tamagui/unagi'
import { YStack } from 'tamagui'

import { useTint } from './ColorToggleButton.client'

// import { HeaderFloating } from './HeaderFloating'
// import { ThemeSearchButtonGroup } from './ThemeSearchButtonGroup'

export const HeaderLogo = ({ floating }: { floating?: boolean }) => {
  const { setNextTint, setTint } = useTint()
  const isHome = true

  return (
    <>
      {isHome ? (
        <YStack cursor="pointer" my={-20}>
          <TamaguiLogo showWords onPress={setNextTint} downscale={floating ? 2 : 1.5} />
        </YStack>
      ) : (
        <Link to="/">
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo onPress={setNextTint} downscale={floating ? 2 : 1.5} />
          </YStack>
        </Link>
      )}
    </>
  )
}
