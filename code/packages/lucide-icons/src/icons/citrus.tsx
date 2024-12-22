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
      <Path
        d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z"
        stroke={color}
      />
      <Path d="M19.65 15.66A8 8 0 0 1 8.35 4.34" stroke={color} />
      <Path d="m14 10-5.5 5.5" stroke={color} />
      <Path d="M14 17.85V10H6.15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Citrus'

export const Citrus = memo<IconProps>(themed(Icon))
