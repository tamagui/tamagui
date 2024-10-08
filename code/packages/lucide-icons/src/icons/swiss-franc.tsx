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
      <Path d="M10 21V3h8" stroke={color} />
      <Path d="M6 16h9" stroke={color} />
      <Path d="M10 9.5h7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SwissFranc'

export const SwissFranc = memo<IconProps>(themed(Icon))
