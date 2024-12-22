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
        d="M14 19.9V16h3a2 2 0 0 0 2-2v-2H5v2c0 1.1.9 2 2 2h3v3.9a2 2 0 1 0 4 0Z"
        stroke={color}
      />
      <Path d="M6 12V2h12v10" stroke={color} />
      <Path d="M14 2v4" stroke={color} />
      <Path d="M10 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Paintbrush2'

export const Paintbrush2 = memo<IconProps>(themed(Icon))
