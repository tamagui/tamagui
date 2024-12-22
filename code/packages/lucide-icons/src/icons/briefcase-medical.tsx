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
      <Path d="M12 11v4" stroke={color} />
      <Path d="M14 13h-4" stroke={color} />
      <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={color} />
      <Path d="M18 6v14" stroke={color} />
      <Path d="M6 6v14" stroke={color} />
      <Rect width="20" height="14" x="2" y="6" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BriefcaseMedical'

export const BriefcaseMedical = memo<IconProps>(themed(Icon))
