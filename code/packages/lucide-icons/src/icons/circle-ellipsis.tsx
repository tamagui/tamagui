import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="M17 12h.01" stroke={color} />
      <Path d="M12 12h.01" stroke={color} />
      <Path d="M7 12h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleEllipsis'

export const CircleEllipsis = memo<IconProps>(themed(Icon))
