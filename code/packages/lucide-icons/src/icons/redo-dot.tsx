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
      <_Circle cx="12" cy="17" r="1" stroke={color} />
      <Path d="M21 7v6h-6" stroke={color} />
      <Path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RedoDot'

export const RedoDot = memo<IconProps>(themed(Icon))
