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
      <Path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3" stroke={color} />
      <Path
        d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"
        stroke={color}
      />
      <Path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z" stroke={color} />
      <Path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sandwich'

export const Sandwich = memo<IconProps>(themed(Icon))
