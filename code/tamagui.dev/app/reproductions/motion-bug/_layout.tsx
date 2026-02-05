import { Configuration } from '@tamagui/web'
import { animationsMotion } from '@tamagui/tamagui-dev-config/v5-motion'
import { Slot } from 'one'
import { Header } from '~/features/site/header/Header'

export default function MotionBugLayout() {
  return (
    <Configuration animationDriver={animationsMotion}>
      <Header />
      <Slot />
    </Configuration>
  )
}
