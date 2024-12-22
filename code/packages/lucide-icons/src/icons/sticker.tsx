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
      <Path
        d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"
        stroke={color}
      />
      <Path d="M14 3v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M8 13h.01" stroke={color} />
      <Path d="M16 13h.01" stroke={color} />
      <Path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sticker'

export const Sticker = memo<IconProps>(themed(Icon))
