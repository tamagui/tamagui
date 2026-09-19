import type { ReactNode } from 'react'
import { XStack, YStack } from 'tamagui'
import { Footer } from '../site/Footer'

export function DocsSyntaxLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <YStack minH="100vh" position="relative" z={1}>
        <XStack mx="auto" maxW={1440} width="100%">
          {children}
        </XStack>
      </YStack>

      <Footer />
    </>
  )
}
