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
      <Path d="M10 9.5 8 12l2 2.5" stroke={color} />
      <Path d="M14 21h1" stroke={color} />
      <Path d="m14 9.5 2 2.5-2 2.5" stroke={color} />
      <Path
        d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2"
        stroke={color}
      />
      <Path d="M9 21h1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareDashedBottomCode'

export const SquareDashedBottomCode = memo<IconProps>(themed(Icon))
