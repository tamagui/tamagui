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
      <Polygon points="13 19 22 12 13 5 13 19" stroke={color} />
      <Polygon points="2 19 11 12 2 5 2 19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FastForward'

export const FastForward = memo<IconProps>(themed(Icon))
