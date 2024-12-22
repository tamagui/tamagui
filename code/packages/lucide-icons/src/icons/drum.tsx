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
      <Path d="m2 2 8 8" stroke={color} />
      <Path d="m22 2-8 8" stroke={color} />
      <Ellipse cx="12" cy="9" rx="10" ry="5" stroke={color} />
      <Path d="M7 13.4v7.9" stroke={color} />
      <Path d="M12 14v8" stroke={color} />
      <Path d="M17 13.4v7.9" stroke={color} />
      <Path d="M2 9v8a10 5 0 0 0 20 0V9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Drum'

export const Drum = memo<IconProps>(themed(Icon))
