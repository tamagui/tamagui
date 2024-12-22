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
      <Rect width="6" height="16" x="4" y="6" rx="2" stroke={color} />
      <Rect width="6" height="9" x="14" y="6" rx="2" stroke={color} />
      <Path d="M22 2H2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignStartHorizontal'

export const AlignStartHorizontal = memo<IconProps>(themed(Icon))
