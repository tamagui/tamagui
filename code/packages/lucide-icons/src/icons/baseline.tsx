import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path d="M4 20h16" stroke={color} />
      <Path d="m6 16 6-12 6 12" stroke={color} />
      <Path d="M8 12h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Baseline'

export const Baseline: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
