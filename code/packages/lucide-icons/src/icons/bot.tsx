import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path d="M12 8V4H8" stroke={color} />
      <Rect width="16" height="12" x="4" y="8" rx="2" stroke={color} />
      <Path d="M2 14h2" stroke={color} />
      <Path d="M20 14h2" stroke={color} />
      <Path d="M15 13v2" stroke={color} />
      <Path d="M9 13v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bot'

export const Bot: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
