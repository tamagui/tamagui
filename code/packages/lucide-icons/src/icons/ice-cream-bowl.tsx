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
        d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0"
        stroke={color}
      />
      <Path d="M12.14 11a3.5 3.5 0 1 1 6.71 0" stroke={color} />
      <Path d="M15.5 6.5a3.5 3.5 0 1 0-7 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IceCreamBowl'

export const IceCreamBowl = memo<IconProps>(themed(Icon))
