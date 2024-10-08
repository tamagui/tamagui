import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path d="m4 4 7.07 17 2.51-7.39L21 11.07z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MousePointer2'

export const MousePointer2 = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
