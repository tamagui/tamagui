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
      <_Circle cx="19" cy="19" r="2" stroke={color} />
      <_Circle cx="5" cy="5" r="2" stroke={color} />
      <Path d="M6.48 3.66a10 10 0 0 1 13.86 13.86" stroke={color} />
      <Path d="m6.41 6.41 11.18 11.18" stroke={color} />
      <Path d="M3.66 6.48a10 10 0 0 0 13.86 13.86" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Diameter'

export const Diameter = memo<IconProps>(themed(Icon))
