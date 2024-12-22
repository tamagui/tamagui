import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Polyline } from 'react-native-svg'
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
      <Polyline points="16 18 22 12 16 6" stroke={color} />
      <Polyline points="8 6 2 12 8 18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Code'

export const Code = memo<IconProps>(themed(Icon))
