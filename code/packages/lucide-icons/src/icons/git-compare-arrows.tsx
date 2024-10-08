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
      <_Circle cx="5" cy="6" r="3" stroke={color} />
      <Path d="M12 6h5a2 2 0 0 1 2 2v7" stroke={color} />
      <Path d="m15 9-3-3 3-3" stroke={color} />
      <_Circle cx="19" cy="18" r="3" stroke={color} />
      <Path d="M12 18H7a2 2 0 0 1-2-2V9" stroke={color} />
      <Path d="m9 15 3 3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitCompareArrows'

export const GitCompareArrows = memo<IconProps>(themed(Icon))
