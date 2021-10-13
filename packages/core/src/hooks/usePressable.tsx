import { Pressable, PressableProps } from 'react-native'

const getPressable = Pressable?.['type']?.['render']

export const usePressable = (props: PressableProps) => {
  const out = getPressable(props)
  const { children, style, ...pressableProps } = out.props
  return [pressableProps, style] as const
}
