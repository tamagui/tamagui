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
      <Rect width="14" height="6" x="5" y="15" rx="2" stroke={color} />
      <Rect width="10" height="6" x="7" y="3" rx="2" stroke={color} />
      <Path d="M2 21h20" stroke={color} />
      <Path d="M2 3h20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignVerticalSpaceBetween'

export const AlignVerticalSpaceBetween: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
