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
      <Path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" stroke={color} />
      <Path d="M2 20h20" stroke={color} />
      <Path d="M14 12v.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'DoorClosed'

export const DoorClosed = memo<IconProps>(themed(Icon))
