import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Rect width="16" height="16" x="4" y="4" rx="2" stroke={color} />
      <Rect width="6" height="6" x="9" y="9" rx="1" stroke={color} />
      <Path d="M15 2v2" stroke={color} />
      <Path d="M15 20v2" stroke={color} />
      <Path d="M2 15h2" stroke={color} />
      <Path d="M2 9h2" stroke={color} />
      <Path d="M20 15h2" stroke={color} />
      <Path d="M20 9h2" stroke={color} />
      <Path d="M9 2v2" stroke={color} />
      <Path d="M9 20v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cpu'

export const Cpu = memo<IconProps>(themed(Icon))
