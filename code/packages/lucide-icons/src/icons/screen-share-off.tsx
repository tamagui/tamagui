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
        d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"
        stroke={color}
      />
      <Path d="M8 21h8" stroke={color} />
      <Path d="M12 17v4" stroke={color} />
      <Path d="m22 3-5 5" stroke={color} />
      <Path d="m17 3 5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ScreenShareOff'

export const ScreenShareOff = memo<IconProps>(themed(Icon))
