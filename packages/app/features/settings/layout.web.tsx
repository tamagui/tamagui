import { FullscreenSpinner, Separator, XStack, YStack } from '@my/ui'
import { useUser } from 'app/utils/useUser'
import { SettingsScreen } from './screen'

export type SettingsLayoutProps = {
  /**
   * web-only
   */
  isSettingsHome?: boolean
  /**
   * web-only
   */
  children?: React.ReactNode
}

export const SettingsLayout = ({ children, isSettingsHome = false }: SettingsLayoutProps) => {
  const { isLoading, user } = useUser()
  if (isLoading || !user) {
    return <FullscreenSpinner />
  }

  return (
    <XStack separator={<Separator vertical />} f={1}>
      <YStack
        backgroundColor="$color1"
        $sm={{ flex: 1, display: isSettingsHome ? 'flex' : 'none' }}
        // this file is web-only so we can safely use CSS
        style={{
          transition: '200ms ease width',
        }}
        $gtSm={{
          width: 300,
        }}
        $gtLg={{
          width: 400,
        }}
      >
        <SettingsScreen />
      </YStack>
      <YStack my="$10" f={1} ai="center" $sm={{ display: isSettingsHome ? 'none' : 'block' }}>
        <YStack width="100%">{children}</YStack>
      </YStack>
    </XStack>
  )
}
