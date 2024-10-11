'use client'

import { usePathname } from 'next/navigation'
import { H3, Spinner, YStack } from 'tamagui'

// TODO: design this page
export const StudioLoading = () => {
  return (
    <YStack>
      <Spinner />
    </YStack>
  )
}
