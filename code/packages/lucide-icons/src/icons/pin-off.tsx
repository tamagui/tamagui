import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
      <Line x1="12" x2="12" y1="17" y2="22" stroke={color} />
      <Path
        d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12"
        stroke={color}
      />
      <Path d="M15 9.34V6h1a2 2 0 0 0 0-4H7.89" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PinOff'

export const PinOff = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
