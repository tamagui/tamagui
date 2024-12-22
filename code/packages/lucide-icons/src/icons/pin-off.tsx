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
      <Path d="M12 17v5" stroke={color} />
      <Path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path
        d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'PinOff'

export const PinOff = memo<IconProps>(themed(Icon))
