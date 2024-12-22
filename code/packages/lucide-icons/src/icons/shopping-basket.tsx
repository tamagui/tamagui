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
      <Path d="m15 11-1 9" stroke={color} />
      <Path d="m19 11-4-7" stroke={color} />
      <Path d="M2 11h20" stroke={color} />
      <Path
        d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"
        stroke={color}
      />
      <Path d="M4.5 15.5h15" stroke={color} />
      <Path d="m5 11 4-7" stroke={color} />
      <Path d="m9 11 1 9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShoppingBasket'

export const ShoppingBasket = memo<IconProps>(themed(Icon))
