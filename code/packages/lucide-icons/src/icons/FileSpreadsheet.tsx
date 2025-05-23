// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const FileSpreadsheet: IconComponent = themed(
  memo(function FileSpreadsheet(props: IconProps) {
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
        <Path
          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          stroke={color}
        />
        <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
        <Path d="M8 13h2" stroke={color} />
        <Path d="M14 13h2" stroke={color} />
        <Path d="M8 17h2" stroke={color} />
        <Path d="M14 17h2" stroke={color} />
      </Svg>
    )
  })
)
