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
      <Path d="M12 2v14" stroke={color} />
      <Path d="m19 9-7 7-7-7" stroke={color} />
      <_Circle cx="12" cy="21" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowDownToDot'

export const ArrowDownToDot = memo<IconProps>(themed(Icon))
