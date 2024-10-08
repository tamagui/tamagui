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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <Path d="M12 12H9.5a2.5 2.5 0 0 1 0-5H17" stroke={color} />
      <Path d="M12 7v10" stroke={color} />
      <Path d="M16 7v10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PilcrowSquare'

export const PilcrowSquare = memo<IconProps>(themed(Icon))
