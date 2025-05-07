import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ArrowDownLeftFromCircle: IconComponent = themed(
  memo(function ArrowDownLeftFromCircle(props: IconProps) {
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
        <Path d="M2 12a10 10 0 1 1 10 10" stroke={color} />
        <Path d="m2 22 10-10" stroke={color} />
        <Path d="M8 22H2v-6" stroke={color} />
      </Svg>
    )
  })
)
