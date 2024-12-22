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
      <Path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" stroke={color} />
      <Path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" stroke={color} />
      <Path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" stroke={color} />
      <Path d="M16.37 2a20.16 20.16 0 0 1 0 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Nfc'

export const Nfc = memo<IconProps>(themed(Icon))
