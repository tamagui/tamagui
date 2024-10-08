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
        d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z"
        stroke={color}
      />
      <Path d="M6 8v1" stroke={color} />
      <Path d="M10 8v1" stroke={color} />
      <Path d="M14 8v1" stroke={color} />
      <Path d="M18 8v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'EthernetPort'

export const EthernetPort = memo<IconProps>(themed(Icon))
