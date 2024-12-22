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
      <Path d="M17 11h1a3 3 0 0 1 0 6h-1" stroke={color} />
      <Path d="M9 12v6" stroke={color} />
      <Path d="M13 12v6" stroke={color} />
      <Path
        d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"
        stroke={color}
      />
      <Path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Beer'

export const Beer = memo<IconProps>(themed(Icon))
