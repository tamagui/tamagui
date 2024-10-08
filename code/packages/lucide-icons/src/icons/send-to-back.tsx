import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Rect x="14" y="14" width="8" height="8" rx="2" stroke={color} />
      <Rect x="2" y="2" width="8" height="8" rx="2" stroke={color} />
      <Path d="M7 14v1a2 2 0 0 0 2 2h1" stroke={color} />
      <Path d="M14 7h1a2 2 0 0 1 2 2v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SendToBack'

export const SendToBack = memo<IconProps>(themed(Icon))
