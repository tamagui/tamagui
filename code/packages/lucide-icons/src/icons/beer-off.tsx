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
      <Path d="M13 13v5" stroke={color} />
      <Path d="M17 11.47V8" stroke={color} />
      <Path d="M17 11h1a3 3 0 0 1 2.745 4.211" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" stroke={color} />
      <Path
        d="M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268"
        stroke={color}
      />
      <Path
        d="M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12"
        stroke={color}
      />
      <Path d="M9 14.6V18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BeerOff'

export const BeerOff = memo<IconProps>(themed(Icon))
