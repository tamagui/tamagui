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
      <Path d="M13 13H8a1 1 0 0 0-1 1v7" stroke={color} />
      <Path d="M14 8h1" stroke={color} />
      <Path d="M17 21v-4" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path
        d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41"
        stroke={color}
      />
      <Path d="M29.5 11.5s5 5 4 5" stroke={color} />
      <Path d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SaveOff'

export const SaveOff = memo<IconProps>(themed(Icon))
