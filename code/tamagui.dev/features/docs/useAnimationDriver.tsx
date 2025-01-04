import type { AnimationDriver } from '@tamagui/web'
import { createContext, useContext, useMemo, useState } from 'react'
import tamaConf from '~/config/tamagui.config'
import { animationsCSS } from '../../config/animations.css'

const ANIMATION_DRIVERS = ['css', 'react-native'] as const

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

  const driver = driverName === 'css' ? animationsCSS : tamaConf.animations

  const value = useMemo(() => {
    return { driverName, nextDriver, setDriverName, driver }
  }, [driver, driverName])

  return (
    <AnimationDriverTogglerContext.Provider value={value}>
      {children}
    </AnimationDriverTogglerContext.Provider>
  )
}
