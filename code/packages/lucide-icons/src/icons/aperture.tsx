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
      <Path d="m14.31 8 5.74 9.94" stroke={color} />
      <Path d="M9.69 8h11.48" stroke={color} />
      <Path d="m7.38 12 5.74-9.94" stroke={color} />
      <Path d="M9.69 16 3.95 6.06" stroke={color} />
      <Path d="M14.31 16H2.83" stroke={color} />
      <Path d="m16.62 12-5.74 9.94" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Aperture'

export const Aperture = memo<IconProps>(themed(Icon))
