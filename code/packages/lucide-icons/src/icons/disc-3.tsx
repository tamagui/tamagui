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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="M6 12c0-1.7.7-3.2 1.8-4.2" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
      <Path d="M18 12c0 1.7-.7 3.2-1.8 4.2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Disc3'

export const Disc3 = memo<IconProps>(themed(Icon))
