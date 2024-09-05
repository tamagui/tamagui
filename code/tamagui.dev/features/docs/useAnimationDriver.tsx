import { createAnimations as createAnimationsCss } from '@tamagui/animations-css'
import type { AnimationDriver } from '@tamagui/web'
import { createContext, useContext, useMemo, useState } from 'react'
import tamaConf from '~/config/tamagui.config'

const ANIMATION_DRIVERS = ['css', 'react-native'] as const

const cssDriverExtra = createAnimationsCss({
  bouncy: 'ease-in 200ms',
  superBouncy: 'ease-in 200ms',
  lazy: 'ease-in 600ms',
  slow: 'ease-in 500ms',
  quick: 'ease-in 100ms',
  medium: 'ease-in 100ms',
  quicker: 'ease-in 85ms',
  quickest: 'ease-in 60ms',
  '100ms': 'ease-in 100ms',
  tooltip: 'ease-in 400ms',
  '75ms': 'ease-in 75ms',
  '200ms': 'ease-in 200ms',
})

export const useAnimationDriverToggler = () => {
  const contextValue = useContext(AnimationDriverTogglerContext)
  if (!contextValue)
    throw new Error('Should be used within the AnimationDriverTogglerContext provider')
  return contextValue
}

const AnimationDriverTogglerContext = createContext<{
  driverName: (typeof ANIMATION_DRIVERS)[number]
  driver: AnimationDriver
  nextDriver: () => void
  setDriverName: (driverName: (typeof ANIMATION_DRIVERS)[number]) => void
} | null>(null)

export const AnimationDriverTogglerContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [driverName, setDriverName] =
    useState<(typeof ANIMATION_DRIVERS)[number]>('react-native')

  const nextDriver = () => {
    setDriverName(
      (prev) =>
        ANIMATION_DRIVERS[
          (ANIMATION_DRIVERS.indexOf(prev) + 1) % ANIMATION_DRIVERS.length
        ]
    )
  }

  const driver = driverName === 'css' ? cssDriverExtra : tamaConf.animations

  const value = useMemo(() => {
    return { driverName, nextDriver, setDriverName, driver }
  }, [driver, driverName])

  return (
    <AnimationDriverTogglerContext.Provider value={value}>
      {children}
    </AnimationDriverTogglerContext.Provider>
  )
}
