import { Suspense, lazy } from 'react'
import { H1, YStack } from 'tamagui'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { useFontLoaded } from '~/features/site/fonts/LoadFonts'

const TakeoutBox3D = lazy(() => import('./TakeoutBox3D'))

// the wordmark is a 900px-wide nowrap H1 scaled down by transform, so it sits absolutely
// inside a sized box - otherwise its layout width overflows the page on small screens
export const TakeoutLogo = () => {
  const fontLoaded = useFontLoaded('Cherry Bomb')

  return (
    <YStack
      width="100%"
      height="430px max-lg:350px max-md:250px max-sm:180px max-xs:140px"
      items="center"
      justify="center"
      position="relative"
      opacity={fontLoaded ? 1 : 0}
    >
      <YStack position="absolute">
        <H1
          select="none"
          fontFamily="cherryBomb"
          fontSize={320}
          lineHeight="234px"
          whiteSpace="nowrap"
          minW={900}
          text="center"
          scale="max-lg:0.8 max-md:0.55 max-sm:0.42 max-xs:0.32"
        >
          Take
          <br />
          <span
            style={{
              display: 'inline-flex',
              position: 'relative',
              transform: 'translateY(-65px)',
            }}
          >
            out
            {/* anchored to the bottom-right of "out" inside the H1 so the title's scale sizes both */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 'calc(100% + 72px)',
                top: 'calc(100% - 26px)',
                width: 400,
                height: 400,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <Suspense fallback={null}>
                <ErrorBoundary noMessage>
                  <TakeoutBox3D />
                </ErrorBoundary>
              </Suspense>
            </span>
          </span>
        </H1>
      </YStack>
    </YStack>
  )
}
