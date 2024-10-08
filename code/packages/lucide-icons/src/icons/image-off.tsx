import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
      <Path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" stroke={color} />
      <Line x1="13.5" x2="6" y1="13.5" y2="21" stroke={color} />
      <Line x1="18" x2="21" y1="12" y2="15" stroke={color} />
      <Path
        d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"
        stroke={color}
      />
      <Path d="M21 15V5a2 2 0 0 0-2-2H9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ImageOff'

export const ImageOff = memo<IconProps>(themed(Icon))
