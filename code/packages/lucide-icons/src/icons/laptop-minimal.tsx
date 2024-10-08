import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Rect } from 'react-native-svg'
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
      <Rect width="18" height="12" x="3" y="4" rx="2" ry="2" stroke={color} />
      <Line x1="2" x2="22" y1="20" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LaptopMinimal'

export const LaptopMinimal = memo<IconProps>(themed(Icon))
