import { TamaguiLogo } from '@tamagui/logo'
import { Link, useUrl } from '@tamagui/unagi'
import { YStack } from 'tamagui'

import { useTint } from './ColorToggleButton.client'

export const HeaderLogo = ({ floating }: { floating?: boolean }) => {
  const { setNextTint } = useTint()
  const url = useUrl()
  const isHome = url.pathname === '/'

  return (
    <>
      {isHome ? (
        <YStack cursor="pointer" my={-20}>
          <TamaguiLogo pathPrefix="/public" onPress={setNextTint} downscale={floating ? 2 : 1.5} />
        </YStack>
      ) : (
        <Link to="/">
          <YStack cursor="pointer" my={-20}>
            <TamaguiLogo
              pathPrefix="/public"
              onPress={setNextTint}
              downscale={floating ? 2 : 1.5}
            />
          </YStack>
        </Link>
      )}
    </>
  )
}
