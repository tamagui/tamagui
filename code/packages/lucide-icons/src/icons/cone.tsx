import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Ellipse, Path } from 'react-native-svg'
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
      <Path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" stroke={color} />
      <Ellipse cx="12" cy="19" rx="9" ry="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cone'

export const Cone = memo<IconProps>(themed(Icon))
