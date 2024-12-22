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
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
        stroke={color}
      />
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M8 15h.01" stroke={color} />
      <Path d="M11.5 13.5a2.5 2.5 0 0 1 0 3" stroke={color} />
      <Path d="M15 12a5 5 0 0 1 0 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileVolume2'

export const FileVolume2 = memo<IconProps>(themed(Icon))
