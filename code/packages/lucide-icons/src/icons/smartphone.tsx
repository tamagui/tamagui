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
      <Rect width="14" height="20" x="5" y="2" rx="2" ry="2" stroke={color} />
      <Path d="M12 18h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Smartphone'

export const Smartphone = memo<IconProps>(themed(Icon))
