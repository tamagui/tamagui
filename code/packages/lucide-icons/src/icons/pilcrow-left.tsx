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
      <Path d="M14 3v11" stroke={color} />
      <Path d="M14 9h-3a3 3 0 0 1 0-6h9" stroke={color} />
      <Path d="M18 3v11" stroke={color} />
      <Path d="M22 18H2l4-4" stroke={color} />
      <Path d="m6 22-4-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PilcrowLeft'

export const PilcrowLeft = memo<IconProps>(themed(Icon))
