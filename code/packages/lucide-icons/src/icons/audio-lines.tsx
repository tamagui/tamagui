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
      <Path d="M2 10v3" stroke={color} />
      <Path d="M6 6v11" stroke={color} />
      <Path d="M10 3v18" stroke={color} />
      <Path d="M14 8v7" stroke={color} />
      <Path d="M18 5v13" stroke={color} />
      <Path d="M22 10v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AudioLines'

export const AudioLines = memo<IconProps>(themed(Icon))
