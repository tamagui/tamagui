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
      <Path d="M21 6H3" stroke={color} />
      <Path d="M7 12H3" stroke={color} />
      <Path d="M7 18H3" stroke={color} />
      <Path
        d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"
        stroke={color}
      />
      <Path d="M11 10v4h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListRestart'

export const ListRestart = memo<IconProps>(themed(Icon))
