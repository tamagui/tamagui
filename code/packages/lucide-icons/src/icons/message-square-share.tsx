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
      <Path d="M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7" stroke={color} />
      <Path d="M16 3h5v5" stroke={color} />
      <Path d="m16 8 5-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareShare'

export const MessageSquareShare: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
