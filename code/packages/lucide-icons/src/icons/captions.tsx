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
      <Rect width="18" height="14" x="3" y="5" rx="2" ry="2" stroke={color} />
      <Path d="M7 15h4M15 15h2M7 11h2M13 11h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Captions'

export const Captions = memo<IconProps>(themed(Icon))
