// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const KanbanSquare: IconComponent = themed(
  memo(function KanbanSquare(props: IconProps) {
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
        <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
        <Path d="M8 7v7" stroke={color} />
        <Path d="M12 7v4" stroke={color} />
        <Path d="M16 7v9" stroke={color} />
      </Svg>
    )
  })
)
