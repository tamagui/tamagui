import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Rect } from 'react-native-svg'
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
      <Rect x="14" y="4" width="4" height="16" rx="1" stroke={color} />
      <Rect x="6" y="4" width="4" height="16" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Pause'

export const Pause = memo<IconProps>(themed(Icon))
