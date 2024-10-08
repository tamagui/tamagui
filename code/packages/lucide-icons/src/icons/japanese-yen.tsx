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
      <Path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" stroke={color} />
      <Path d="M6 15h12" stroke={color} />
      <Path d="M6 11h12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'JapaneseYen'

export const JapaneseYen = memo<IconProps>(themed(Icon))
