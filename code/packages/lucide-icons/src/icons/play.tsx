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
      <Polygon points="5 3 19 12 5 21 5 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Play'

export const Play = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
