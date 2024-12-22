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
      <Path d="M6 19v-3" stroke={color} />
      <Path d="M10 19v-3" stroke={color} />
      <Path d="M14 19v-3" stroke={color} />
      <Path d="M18 19v-3" stroke={color} />
      <Path d="M8 11V9" stroke={color} />
      <Path d="M16 11V9" stroke={color} />
      <Path d="M12 11V9" stroke={color} />
      <Path d="M2 15h20" stroke={color} />
      <Path
        d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'MemoryStick'

export const MemoryStick = memo<IconProps>(themed(Icon))
