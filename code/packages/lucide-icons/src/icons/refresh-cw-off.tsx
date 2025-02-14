import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
        d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47"
        stroke={color}
      />
      <Path d="M8 16H3v5" stroke={color} />
      <Path d="M3 12C3 9.51 4 7.26 5.64 5.64" stroke={color} />
      <Path
        d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64"
        stroke={color}
      />
      <Path d="M21 12c0 1-.16 1.97-.47 2.87" stroke={color} />
      <Path d="M21 3v5h-5" stroke={color} />
      <Path d="M22 22 2 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RefreshCwOff'

export const RefreshCwOff: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
