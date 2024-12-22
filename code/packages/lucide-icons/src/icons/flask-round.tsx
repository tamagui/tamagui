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
      <Path d="M10 2v7.31" stroke={color} />
      <Path d="M14 9.3V1.99" stroke={color} />
      <Path d="M8.5 2h7" stroke={color} />
      <Path d="M14 9.3a6.5 6.5 0 1 1-4 0" stroke={color} />
      <Path d="M5.52 16h12.96" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FlaskRound'

export const FlaskRound = memo<IconProps>(themed(Icon))
