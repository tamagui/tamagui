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
      <_Circle cx="12" cy="12" r="2" stroke={color} />
      <Path d="M12 2v4" stroke={color} />
      <Path d="m6.8 15-3.5 2" stroke={color} />
      <Path d="m20.7 7-3.5 2" stroke={color} />
      <Path d="M6.8 9 3.3 7" stroke={color} />
      <Path d="m20.7 17-3.5-2" stroke={color} />
      <Path d="m9 22 3-8 3 8" stroke={color} />
      <Path d="M8 22h8" stroke={color} />
      <Path d="M18 18.7a9 9 0 1 0-12 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FerrisWheel'

export const FerrisWheel = memo<IconProps>(themed(Icon))
