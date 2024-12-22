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
      <Path d="M21 6H3" stroke={color} />
      <Path d="M10 12H3" stroke={color} />
      <Path d="M10 18H3" stroke={color} />
      <_Circle cx="17" cy="15" r="3" stroke={color} />
      <Path d="m21 19-1.9-1.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TextSearch'

export const TextSearch = memo<IconProps>(themed(Icon))
