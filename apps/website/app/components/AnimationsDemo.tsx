import { AnimationsDemo as AnimationsDemoBase } from '@tamagui/demos'
import { useTint } from '@tamagui/logo'

export const AnimationsDemo = (props) => {
  const { tint } = useTint()
  return <AnimationsDemoBase tint={tint} {...props} />
}
