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
      <Path d="M7 2h10" stroke={color} />
      <Path d="M5 6h14" stroke={color} />
      <Rect width="18" height="12" x="3" y="10" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GalleryVerticalEnd'

export const GalleryVerticalEnd: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
