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
      <Path d="m4 4 2.5 2.5" stroke={color} />
      <Path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" stroke={color} />
      <Path d="M15 5 5 15" stroke={color} />
      <Path d="M14 17v.01" stroke={color} />
      <Path d="M10 16v.01" stroke={color} />
      <Path d="M13 13v.01" stroke={color} />
      <Path d="M16 10v.01" stroke={color} />
      <Path d="M11 20v.01" stroke={color} />
      <Path d="M17 14v.01" stroke={color} />
      <Path d="M20 11v.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShowerHead'

export const ShowerHead = memo<IconProps>(themed(Icon))
