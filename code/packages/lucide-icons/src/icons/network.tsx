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
      <Rect x="16" y="16" width="6" height="6" rx="1" stroke={color} />
      <Rect x="2" y="16" width="6" height="6" rx="1" stroke={color} />
      <Rect x="9" y="2" width="6" height="6" rx="1" stroke={color} />
      <Path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" stroke={color} />
      <Path d="M12 12V8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Network'

export const Network = memo<IconProps>(themed(Icon))
