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
      <Path d="M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2" stroke={color} />
      <Path d="M22 15V5a2 2 0 0 0-2-2H9" stroke={color} />
      <Path d="M8 21h8" stroke={color} />
      <Path d="M12 17v4" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorOff'

export const MonitorOff = memo<IconProps>(themed(Icon))
