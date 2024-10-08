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
      <Path d="M13 4v16" stroke={color} />
      <Path d="M17 4v16" stroke={color} />
      <Path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Pilcrow'

export const Pilcrow = memo<IconProps>(themed(Icon))
