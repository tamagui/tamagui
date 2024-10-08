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
      <Path d="M12 3V2" stroke={color} />
      <Path d="M5 10a7.1 7.1 0 0 1 14 0" stroke={color} />
      <Path d="M4 10h16" stroke={color} />
      <Path d="M2 14h12a2 2 0 1 1 0 4h-2" stroke={color} />
      <Path
        d="m15.4 17.4 3.2-2.8a2 2 0 0 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2L5 18"
        stroke={color}
      />
      <Path d="M5 14v7H2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'HandPlatter'

export const HandPlatter = memo<IconProps>(themed(Icon))
