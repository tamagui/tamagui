import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M10 9.5 8 12l2 2.5" stroke={color} />
      <Path d="m14 9.5 2 2.5-2 2.5" stroke={color} />
      <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageCircleCode'

export const MessageCircleCode: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
