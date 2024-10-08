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
      <Path d="M8 6v6" stroke={color} />
      <Path d="M15 6v6" stroke={color} />
      <Path d="M2 12h19.6" stroke={color} />
      <Path
        d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"
        stroke={color}
      />
      <_Circle cx="7" cy="18" r="2" stroke={color} />
      <Path d="M9 18h5" stroke={color} />
      <_Circle cx="16" cy="18" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bus'

export const Bus = memo<IconProps>(themed(Icon))
