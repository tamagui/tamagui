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
      <Path d="M19 15V9" stroke={color} />
      <Path d="M15 15h-3v4l-7-7 7-7v4h3v6z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowBigLeftDash'

export const ArrowBigLeftDash = memo<IconProps>(themed(Icon))
