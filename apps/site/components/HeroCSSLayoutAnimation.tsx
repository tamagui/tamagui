import { useAnimationDriverToggler } from 'hooks/useAnimationDriverToggler'
import { useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'tamagui'

import { AnimationCSSDriverLayoutDemo } from './demos'
import { HeroContainer } from './HeroContainer'

export function HeroCSSLayoutAnimation(props: any) {
  return (
    <HeroContainer {...props}>
      <AnimationCSSDriverLayoutDemoDriverHandled />
    </HeroContainer>
  )
}

function AnimationCSSDriverLayoutDemoDriverHandled(props: any) {
  const { driverName, nextDriver } = useAnimationDriverToggler()

  useIsomorphicLayoutEffect(() => {
    if (driverName !== 'css') {
      nextDriver()
    }
  }, [])

  return (
    <>
      <AnimationCSSDriverLayoutDemo />
    </>
  )
}
