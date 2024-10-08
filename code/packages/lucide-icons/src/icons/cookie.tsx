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
      <Path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" stroke={color} />
      <Path d="M8.5 8.5v.01" stroke={color} />
      <Path d="M16 15.5v.01" stroke={color} />
      <Path d="M12 12v.01" stroke={color} />
      <Path d="M11 17v.01" stroke={color} />
      <Path d="M7 14v.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cookie'

export const Cookie = memo<IconProps>(themed(Icon))
