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
      <Path d="m17 17-5 5V12l-5 5" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M14.5 9.5 17 7l-5-5v4.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BluetoothOff'

export const BluetoothOff = memo<IconProps>(themed(Icon))
