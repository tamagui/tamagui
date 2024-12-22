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
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <_Circle cx="19" cy="5" r="2" stroke={color} />
      <_Circle cx="5" cy="19" r="2" stroke={color} />
      <Path d="M10.4 21.9a10 10 0 0 0 9.941-15.416" stroke={color} />
      <Path d="M13.5 2.1a10 10 0 0 0-9.841 15.416" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Orbit'

export const Orbit = memo<IconProps>(themed(Icon))
