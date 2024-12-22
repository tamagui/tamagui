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
      <Path d="M12 20h.01" stroke={color} />
      <Path d="M8.5 16.429a5 5 0 0 1 7 0" stroke={color} />
      <Path d="M5 12.859a10 10 0 0 1 5.17-2.69" stroke={color} />
      <Path d="M19 12.859a10 10 0 0 0-2.007-1.523" stroke={color} />
      <Path d="M2 8.82a15 15 0 0 1 4.177-2.643" stroke={color} />
      <Path d="M22 8.82a15 15 0 0 0-11.288-3.764" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'WifiOff'

export const WifiOff = memo<IconProps>(themed(Icon))
