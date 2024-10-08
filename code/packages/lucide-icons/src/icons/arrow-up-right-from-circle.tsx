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
      <Path d="M22 12A10 10 0 1 1 12 2" stroke={color} />
      <Path d="M22 2 12 12" stroke={color} />
      <Path d="M16 2h6v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpRightFromCircle'

export const ArrowUpRightFromCircle = memo<IconProps>(themed(Icon))
