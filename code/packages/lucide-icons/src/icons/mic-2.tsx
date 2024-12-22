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
      <Path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" stroke={color} />
      <_Circle cx="17" cy="7" r="5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Mic2'

export const Mic2 = memo<IconProps>(themed(Icon))
