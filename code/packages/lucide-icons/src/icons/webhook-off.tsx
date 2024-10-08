import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15" stroke={color} />
      <Path d="M9 3.4a4 4 0 0 1 6.52.66" stroke={color} />
      <Path d="m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05" stroke={color} />
      <Path d="M20.3 20.3a4 4 0 0 1-2.3.7" stroke={color} />
      <Path d="M18.6 13a4 4 0 0 1 3.357 3.414" stroke={color} />
      <Path d="m12 6 .6 1" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'WebhookOff'

export const WebhookOff = memo<IconProps>(themed(Icon))
