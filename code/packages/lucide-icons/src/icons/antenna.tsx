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
      <Path d="M2 12 7 2" stroke={color} />
      <Path d="m7 12 5-10" stroke={color} />
      <Path d="m12 12 5-10" stroke={color} />
      <Path d="m17 12 5-10" stroke={color} />
      <Path d="M4.5 7h15" stroke={color} />
      <Path d="M12 16v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Antenna'

export const Antenna = memo<IconProps>(themed(Icon))
