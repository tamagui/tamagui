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
      <Path d="M21 9H3" stroke={color} />
      <Path d="M21 15H3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Rows3'

export const Rows3: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
