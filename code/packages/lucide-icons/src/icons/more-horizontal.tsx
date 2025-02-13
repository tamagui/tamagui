import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle } from 'react-native-svg'
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
      <_Circle cx="12" cy="12" r="1" stroke={color} />
      <_Circle cx="19" cy="12" r="1" stroke={color} />
      <_Circle cx="5" cy="12" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoreHorizontal'

export const MoreHorizontal: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
