import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Table: IconComponent = themed(
  memo(function Table(props: IconProps) {
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
        <Path d="M12 3v18" stroke={color} />
        <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
        <Path d="M3 9h18" stroke={color} />
        <Path d="M3 15h18" stroke={color} />
      </Svg>
    )
  })
)
