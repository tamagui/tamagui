import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const GalleryVertical: IconComponent = themed(
  memo(function GalleryVertical(props: IconProps) {
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
        <Path d="M3 2h18" stroke={color} />
        <Rect width="18" height="12" x="3" y="6" rx="2" stroke={color} />
        <Path d="M3 22h18" stroke={color} />
      </Svg>
    )
  })
)
