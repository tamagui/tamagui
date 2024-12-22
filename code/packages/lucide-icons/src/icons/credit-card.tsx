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
      <Rect width="20" height="14" x="2" y="5" rx="2" stroke={color} />
      <Line x1="2" x2="22" y1="10" y2="10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CreditCard'

export const CreditCard = memo<IconProps>(themed(Icon))
