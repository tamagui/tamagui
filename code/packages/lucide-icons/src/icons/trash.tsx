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
      <Path d="M3 6h18" stroke={color} />
      <Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke={color} />
      <Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Trash'

export const Trash = memo<IconProps>(themed(Icon))
