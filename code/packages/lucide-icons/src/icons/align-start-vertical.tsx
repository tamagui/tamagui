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
      <Rect width="9" height="6" x="6" y="14" rx="2" stroke={color} />
      <Rect width="16" height="6" x="6" y="4" rx="2" stroke={color} />
      <Path d="M2 2v20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignStartVertical'

export const AlignStartVertical = memo<IconProps>(themed(Icon))
