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
      <Path
        d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
        stroke={color}
      />
      <Line x1="10" x2="8" y1="5" y2="7" stroke={color} />
      <Line x1="2" x2="22" y1="12" y2="12" stroke={color} />
      <Line x1="7" x2="7" y1="19" y2="21" stroke={color} />
      <Line x1="17" x2="17" y1="19" y2="21" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bath'

export const Bath = memo<IconProps>(themed(Icon))
