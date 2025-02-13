import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path, Rect } from 'react-native-svg'
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
      <Line x1="15" x2="15" y1="12" y2="18" stroke={color} />
      <Line x1="12" x2="18" y1="15" y2="15" stroke={color} />
      <Rect width="14" height="14" x="8" y="8" rx="2" ry="2" stroke={color} />
      <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CopyPlus'

export const CopyPlus: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
