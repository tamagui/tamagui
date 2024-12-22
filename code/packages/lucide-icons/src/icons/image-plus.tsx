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
      <Path d="M16 5h6" stroke={color} />
      <Path d="M19 2v6" stroke={color} />
      <Path
        d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"
        stroke={color}
      />
      <Path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke={color} />
      <_Circle cx="9" cy="9" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ImagePlus'

export const ImagePlus = memo<IconProps>(themed(Icon))
