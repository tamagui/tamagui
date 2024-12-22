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
      <Path d="M12.75 7.09a3 3 0 0 1 2.16 2.16" stroke={color} />
      <Path
        d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568"
        stroke={color}
      />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" stroke={color} />
      <Path d="M9.13 9.13a3 3 0 0 0 3.74 3.74" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MapPinOff'

export const MapPinOff = memo<IconProps>(themed(Icon))
