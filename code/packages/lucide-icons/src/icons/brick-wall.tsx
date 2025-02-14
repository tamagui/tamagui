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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <Path d="M12 9v6" stroke={color} />
      <Path d="M16 15v6" stroke={color} />
      <Path d="M16 3v6" stroke={color} />
      <Path d="M3 15h18" stroke={color} />
      <Path d="M3 9h18" stroke={color} />
      <Path d="M8 15v6" stroke={color} />
      <Path d="M8 3v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BrickWall'

export const BrickWall: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
