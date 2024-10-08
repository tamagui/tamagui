import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M4 11a9 9 0 0 1 9 9" stroke={color} />
      <Path d="M4 4a16 16 0 0 1 16 16" stroke={color} />
      <_Circle cx="5" cy="19" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Rss'

export const Rss = memo<IconProps>(themed(Icon))
