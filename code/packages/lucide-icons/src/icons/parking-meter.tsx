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
      <Path d="M9 9a3 3 0 1 1 6 0" stroke={color} />
      <Path d="M12 12v3" stroke={color} />
      <Path d="M11 15h2" stroke={color} />
      <Path
        d="M19 9a7 7 0 1 0-13.6 2.3C6.4 14.4 8 19 8 19h8s1.6-4.6 2.6-7.7c.3-.8.4-1.5.4-2.3"
        stroke={color}
      />
      <Path d="M12 19v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ParkingMeter'

export const ParkingMeter = memo<IconProps>(themed(Icon))
