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
      <Path d="M8 21s-4-3-4-9 4-9 4-9" stroke={color} />
      <Path d="M16 3s4 3 4 9-4 9-4 9" stroke={color} />
      <Line x1="15" x2="9" y1="9" y2="15" stroke={color} />
      <Line x1="9" x2="15" y1="9" y2="15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Variable'

export const Variable: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
