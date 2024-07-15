'use client'

import { usePathname } from 'next/navigation'
import { H3, Spinner, YStack } from 'tamagui'

// TODO: design this page
export const StudioLoading = ({ name }: { name: string }) => {
  const pageName = usePathname()?.split('/').pop()

  return (
    <YStack>
      <Spinner />
    </YStack>
  )
}
