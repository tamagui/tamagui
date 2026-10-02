import { memo, type JSX } from 'react'
import { Svg, Circle, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Info: (props: IconProps) => JSX.Element = themed(
  memo(function Info(props: IconProps) {
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
        <Circle cx="12" cy="12" r="10" stroke={color} />
        <Path d="M12 16v-4" stroke={color} />
        <Path d="M12 8h.01" stroke={color} />
      </Svg>
    )
  })
)
