import { memo } from 'react'
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
      <Path
        d="M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z"
        stroke={color}
      />
      <Path d="M17.75 7 15 2.1" stroke={color} />
      <Path d="M10.9 4.8 13 9" stroke={color} />
      <Path d="m7.9 9.7 2 4.4" stroke={color} />
      <Path d="M4.9 14.7 7 18.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CandyCane'

export const CandyCane = memo<IconProps>(themed(Icon))
