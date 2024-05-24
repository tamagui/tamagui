import { Slot, Stack } from 'vxs'
import { isWeb } from 'tamagui'
import { Providers } from '../src/Providers'
import React from 'react'

globalThis['React'] = React

if (import.meta.env.DEV) {
  if (React.version.startsWith('18.')) {
    console.error(`\n\n\n❌ not on react 19\n\n\n`)
  }
}

export default function Layout() {
  return (
    <Providers>
      {isWeb ? (
        <Slot />
      ) : (
        <Stack
          screenOptions={
            isWeb
              ? {
                  header() {
                    return null
                  },

                  contentStyle: {
                    position: 'relative',
                    backgroundColor: 'red',
                  },
                }
              : {}
          }
        />
      )}
    </Providers>
  )
}
