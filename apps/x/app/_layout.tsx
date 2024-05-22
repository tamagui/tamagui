import { Slot, Stack } from 'vxs'
import { isWeb } from 'tamagui'
import { Providers } from '../src/Providers'
import React from 'react'

globalThis['React'] = React

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
