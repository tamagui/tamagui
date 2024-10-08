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
      <Rect width="16" height="6" x="2" y="2" rx="2" stroke={color} />
      <Path
        d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke={color}
      />
      <Rect width="4" height="6" x="8" y="16" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PaintRoller'

export const PaintRoller = memo<IconProps>(themed(Icon))
