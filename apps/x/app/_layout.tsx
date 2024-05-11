import { Slot, Stack } from '@vxrn/router'
import { isWeb } from 'tamagui'
import { Providers } from '../src/Providers'
import tamaguiConfig from '~/src/tamagui.config'

export default function Layout() {
  return (
    <Providers>
      <style
        data-is="tamagui-get-css"
        dangerouslySetInnerHTML={{
          __html: tamaguiConfig.getCSS({
            exclude: 'design-system',
          }),
        }}
      />

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
