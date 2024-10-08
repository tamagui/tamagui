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
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <Path d="M13 6h3a2 2 0 0 1 2 2v7" stroke={color} />
      <Path d="M11 18H8a2 2 0 0 1-2-2V9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitCompare'

export const GitCompare = memo<IconProps>(themed(Icon))
