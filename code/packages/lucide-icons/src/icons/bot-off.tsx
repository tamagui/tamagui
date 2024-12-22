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
      <Path d="M13.67 8H18a2 2 0 0 1 2 2v4.33" stroke={color} />
      <Path d="M2 14h2" stroke={color} />
      <Path d="M20 14h2" stroke={color} />
      <Path d="M22 22 2 2" stroke={color} />
      <Path
        d="M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586"
        stroke={color}
      />
      <Path d="M9 13v2" stroke={color} />
      <Path d="M9.67 4H12v2.33" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BotOff'

export const BotOff = memo<IconProps>(themed(Icon))
