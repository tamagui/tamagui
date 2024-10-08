import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" stroke={color} />
      <Path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z" stroke={color} />
      <Path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z" stroke={color} />
      <Path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Component'

export const Component = memo<IconProps>(themed(Icon))
