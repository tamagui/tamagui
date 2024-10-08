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
      <Path d="M12 5H6a2 2 0 0 0-2 2v3" stroke={color} />
      <Path d="m9 8 3-3-3-3" stroke={color} />
      <Path
        d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'RotateCwSquare'

export const RotateCwSquare = memo<IconProps>(themed(Icon))
