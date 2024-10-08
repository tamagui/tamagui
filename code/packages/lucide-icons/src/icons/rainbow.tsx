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
      <Path d="M22 17a10 10 0 0 0-20 0" stroke={color} />
      <Path d="M6 17a6 6 0 0 1 12 0" stroke={color} />
      <Path d="M10 17a2 2 0 0 1 4 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Rainbow'

export const Rainbow = memo<IconProps>(themed(Icon))
