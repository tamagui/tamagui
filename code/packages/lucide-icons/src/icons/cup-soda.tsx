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
        d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"
        stroke={color}
      />
      <Path d="M5 8h14" stroke={color} />
      <Path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" stroke={color} />
      <Path d="m12 8 1-6h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CupSoda'

export const CupSoda = memo<IconProps>(themed(Icon))
