import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path
        d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
        stroke={color}
      />
      <Line x1="22" x2="16" y1="9" y2="15" stroke={color} />
      <Line x1="16" x2="22" y1="9" y2="15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'VolumeX'

export const VolumeX: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
