// this provides some helpful reset styles to ensure a more consistent look
// TODO: make this configurable
// import '@tamagui/core/reset.css'

import { Slot } from 'expo-router'
import React, { Suspense } from 'react'
import { TamaguiProvider } from 'tamagui'

import config from '../tamagui.config'

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      {/* if you want nice React 18 concurrent hydration, you'll want Suspense near the root */}
      <Suspense>
        <Slot />
      </Suspense>
    </TamaguiProvider>
  )
}
