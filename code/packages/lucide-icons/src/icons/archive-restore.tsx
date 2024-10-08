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
      <Rect width="20" height="5" x="2" y="3" rx="1" stroke={color} />
      <Path d="M4 8v11a2 2 0 0 0 2 2h2" stroke={color} />
      <Path d="M20 8v11a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="m9 15 3-3 3 3" stroke={color} />
      <Path d="M12 12v9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArchiveRestore'

export const ArchiveRestore = memo<IconProps>(themed(Icon))
