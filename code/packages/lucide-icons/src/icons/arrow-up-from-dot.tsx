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
      <Path d="m5 9 7-7 7 7" stroke={color} />
      <Path d="M12 16V2" stroke={color} />
      <_Circle cx="12" cy="21" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpFromDot'

export const ArrowUpFromDot: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
