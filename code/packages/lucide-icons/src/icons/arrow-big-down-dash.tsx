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
      <Path d="M15 5H9" stroke={color} />
      <Path d="M15 9v3h4l-7 7-7-7h4V9z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowBigDownDash'

export const ArrowBigDownDash = memo<IconProps>(themed(Icon))
