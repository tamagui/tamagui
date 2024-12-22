import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Polygon } from 'react-native-svg'
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
      <Polygon points="11 19 2 12 11 5 11 19" stroke={color} />
      <Polygon points="22 19 13 12 22 5 22 19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Rewind'

export const Rewind = memo<IconProps>(themed(Icon))
