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
      <Path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" stroke={color} />
      <Path
        d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
        stroke={color}
      />
      <Path d="m2 16 6 6" stroke={color} />
      <_Circle cx="16" cy="9" r="2.9" stroke={color} />
      <_Circle cx="6" cy="5" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'HandCoins'

export const HandCoins = memo<IconProps>(themed(Icon))
