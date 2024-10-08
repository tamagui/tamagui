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
      <Path d="M2 17 17 2" stroke={color} />
      <Path d="m2 14 8 8" stroke={color} />
      <Path d="m5 11 8 8" stroke={color} />
      <Path d="m8 8 8 8" stroke={color} />
      <Path d="m11 5 8 8" stroke={color} />
      <Path d="m14 2 8 8" stroke={color} />
      <Path d="M7 22 22 7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TrainTrack'

export const TrainTrack = memo<IconProps>(themed(Icon))
