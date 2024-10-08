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
      <Ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} />
      <Path d="M3 5v14a9 3 0 0 0 18 0V5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cylinder'

export const Cylinder = memo<IconProps>(themed(Icon))
