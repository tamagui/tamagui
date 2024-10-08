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
      <Path d="M12 13V2l8 4-8 4" stroke={color} />
      <Path d="M20.561 10.222a9 9 0 1 1-12.55-5.29" stroke={color} />
      <Path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Goal'

export const Goal = memo<IconProps>(themed(Icon))
