import { memo, type JSX } from 'react'
import { Svg, Circle, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ShoppingCart: (props: IconProps) => JSX.Element = themed(
  memo(function ShoppingCart(props: IconProps) {
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
          d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"
          stroke={color}
        />
        <Path
          d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"
          stroke={color}
        />
        <Circle cx="18" cy="20" r="2" stroke={color} />
        <Circle cx="8" cy="20" r="2" stroke={color} />
      </Svg>
    )
  })
)
