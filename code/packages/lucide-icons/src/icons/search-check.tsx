import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="m8 11 2 2 4-4" stroke={color} />
      <_Circle cx="11" cy="11" r="8" stroke={color} />
      <Path d="m21 21-4.3-4.3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SearchCheck'

export const SearchCheck: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
