import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path
        d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"
        stroke={color}
      />
      <Path d="m9 18-1.5-1.5" stroke={color} />
      <_Circle cx="5" cy="14" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileSearch'

export const FileSearch = memo<IconProps>(themed(Icon))
