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
      <Rect x="14" y="14" width="4" height="6" rx="2" stroke={color} />
      <Rect x="6" y="4" width="4" height="6" rx="2" stroke={color} />
      <Path d="M6 20h4" stroke={color} />
      <Path d="M14 10h4" stroke={color} />
      <Path d="M6 14h2v6" stroke={color} />
      <Path d="M14 4h2v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Binary'

export const Binary = memo<IconProps>(themed(Icon))
