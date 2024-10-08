import { memo } from 'react'
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
      <Path d="M2 3v18" stroke={color} />
      <Rect width="12" height="18" x="6" y="3" rx="2" stroke={color} />
      <Path d="M22 3v18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GalleryHorizontal'

export const GalleryHorizontal = memo<IconProps>(themed(Icon))
