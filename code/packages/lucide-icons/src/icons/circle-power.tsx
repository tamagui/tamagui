import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M12 7v4" stroke={color} />
      <Path d="M7.998 9.003a5 5 0 1 0 8-.005" stroke={color} />
      <_Circle cx="12" cy="12" r="10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CirclePower'

export const CirclePower = memo<IconProps>(themed(Icon))
