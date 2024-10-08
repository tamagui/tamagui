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
      <Path d="M13 4h3a2 2 0 0 1 2 2v14" stroke={color} />
      <Path d="M2 20h3" stroke={color} />
      <Path d="M13 20h9" stroke={color} />
      <Path d="M10 12v.01" stroke={color} />
      <Path
        d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'DoorOpen'

export const DoorOpen = memo<IconProps>(themed(Icon))
