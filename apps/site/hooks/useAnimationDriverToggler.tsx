import { createAnimations as createAnimationsCss } from '@tamagui/animations-css'
// import { createAnimations as createAnimationsReanimated } from '@tamagui/animations-reanimated'
import { createContext, useContext, useMemo, useState } from 'react'
import { AnimationDriverProvider } from 'tamagui'

// import { createAnimations as createAnimationsReactNative } from '@tamagui/animations-react-native'
import tamaConf from '../tamagui.config'

const ANIMATION_DRIVERS = ['css', 'react-native'] as const

export const useAnimationDriverToggler = () => {
  return useContext(AnimationDriverTogglerContext)
}

const AnimationDriverTogglerContext = createContext<{
  driverName: (typeof ANIMATION_DRIVERS)[number]
  nextDriver: () => void
}>(null as any)

export const AnimationDriverTogglerContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [driverName, setDriverName] =
    useState<(typeof ANIMATION_DRIVERS)[number]>('react-native')

  const nextDriver = () => {
    setDriverName(
      ANIMATION_DRIVERS[
        (ANIMATION_DRIVERS.indexOf(driverName) + 1) % ANIMATION_DRIVERS.length
      ]
    )
  }

  const driver = useMemo(() => {
    if (driverName === 'css')
      return createAnimationsCss({
        bouncy: 'ease-in 200ms',
        lazy: 'ease-in 600ms',
        slow: 'ease-in 500ms',
        quick: 'ease-in 100ms',
        tooltip: 'ease-in 400ms',
      })

    if (driverName === 'react-native') return tamaConf.animations
    // if (driverName === 'reanimated') return createAnimationsReanimated({})
    return null
  }, [driverName])

  return (
    <AnimationDriverTogglerContext.Provider value={{ driverName, nextDriver }}>
      <AnimationDriverProvider driver={driver} key={driverName}>
        {children}
      </AnimationDriverProvider>
    </AnimationDriverTogglerContext.Provider>
  )
}
