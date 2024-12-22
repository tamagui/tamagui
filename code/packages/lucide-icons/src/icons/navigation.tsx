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
      <Polygon points="3 11 22 2 13 21 11 13 3 11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Navigation'

export const Navigation = memo<IconProps>(themed(Icon))
