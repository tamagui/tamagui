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
      <Path d="M12 12h.01" stroke={color} />
      <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={color} />
      <Path d="M22 13a18.15 18.15 0 0 1-20 0" stroke={color} />
      <Rect width="20" height="14" x="2" y="6" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BriefcaseBusiness'

export const BriefcaseBusiness = memo<IconProps>(themed(Icon))
