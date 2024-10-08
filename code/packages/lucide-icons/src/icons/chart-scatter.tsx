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
      <_Circle cx="7.5" cy="7.5" r=".5" fill="currentColor" stroke={color} />
      <_Circle cx="18.5" cy="5.5" r=".5" fill="currentColor" stroke={color} />
      <_Circle cx="11.5" cy="11.5" r=".5" fill="currentColor" stroke={color} />
      <_Circle cx="7.5" cy="16.5" r=".5" fill="currentColor" stroke={color} />
      <_Circle cx="17.5" cy="14.5" r=".5" fill="currentColor" stroke={color} />
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartScatter'

export const ChartScatter = memo<IconProps>(themed(Icon))
