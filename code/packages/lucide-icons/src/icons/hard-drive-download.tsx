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
      <Path d="M12 2v8" stroke={color} />
      <Path d="m16 6-4 4-4-4" stroke={color} />
      <Rect width="20" height="8" x="2" y="14" rx="2" stroke={color} />
      <Path d="M6 18h.01" stroke={color} />
      <Path d="M10 18h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'HardDriveDownload'

export const HardDriveDownload = memo<IconProps>(themed(Icon))
