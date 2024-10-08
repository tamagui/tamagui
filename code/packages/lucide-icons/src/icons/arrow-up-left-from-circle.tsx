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
      <Path d="M2 8V2h6" stroke={color} />
      <Path d="m2 2 10 10" stroke={color} />
      <Path d="M12 2A10 10 0 1 1 2 12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpLeftFromCircle'

export const ArrowUpLeftFromCircle = memo<IconProps>(themed(Icon))
