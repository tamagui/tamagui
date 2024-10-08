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
      <Path d="M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2" stroke={color} />
      <Path d="M14.12 3.88 16 2" stroke={color} />
      <Path d="M22 13h-4v-2a4 4 0 0 0-4-4h-1.3" stroke={color} />
      <Path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13" stroke={color} />
      <Path d="M12 20v-8" stroke={color} />
      <Path d="M6 13H2" stroke={color} />
      <Path d="M3 21c0-2.1 1.7-3.9 3.8-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BugOff'

export const BugOff = memo<IconProps>(themed(Icon))
