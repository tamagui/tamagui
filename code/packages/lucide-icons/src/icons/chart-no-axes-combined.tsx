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
      <Path d="M12 16v5" stroke={color} />
      <Path d="M16 14v7" stroke={color} />
      <Path d="M20 10v11" stroke={color} />
      <Path
        d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"
        stroke={color}
      />
      <Path d="M4 18v3" stroke={color} />
      <Path d="M8 14v7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartNoAxesCombined'

export const ChartNoAxesCombined = memo<IconProps>(themed(Icon))
