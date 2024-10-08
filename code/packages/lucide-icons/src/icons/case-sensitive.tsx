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
      <Path d="m3 15 4-8 4 8" stroke={color} />
      <Path d="M4 13h6" stroke={color} />
      <_Circle cx="18" cy="12" r="3" stroke={color} />
      <Path d="M21 9v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CaseSensitive'

export const CaseSensitive = memo<IconProps>(themed(Icon))
