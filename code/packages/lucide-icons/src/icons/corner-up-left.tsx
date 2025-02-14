import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Polyline } from 'react-native-svg'
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
      <Polyline points="9 14 4 9 9 4" stroke={color} />
      <Path d="M20 20v-7a4 4 0 0 0-4-4H4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CornerUpLeft'

export const CornerUpLeft: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
