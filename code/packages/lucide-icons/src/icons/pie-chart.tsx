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
      <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={color} />
      <Path d="M22 12A10 10 0 0 0 12 2v10z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PieChart'

export const PieChart = memo<IconProps>(themed(Icon))
