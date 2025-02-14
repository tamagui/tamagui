import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path d="M13 17V9" stroke={color} />
      <Path d="M18 17v-3" stroke={color} />
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
      <Path d="M8 17V5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartColumnDecreasing'

export const ChartColumnDecreasing: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
