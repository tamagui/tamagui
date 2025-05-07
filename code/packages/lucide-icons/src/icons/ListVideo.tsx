import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ListVideo: IconComponent = themed(
  memo(function ListVideo(props: IconProps) {
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
        <Path d="M12 12H3" stroke={color} />
        <Path d="M16 6H3" stroke={color} />
        <Path d="M12 18H3" stroke={color} />
        <Path d="m16 12 5 3-5 3v-6Z" stroke={color} />
      </Svg>
    )
  })
)
