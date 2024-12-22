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
      <Path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" stroke={color} />
      <Path d="M14 13.12c0 2.38 0 6.38-1 8.88" stroke={color} />
      <Path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" stroke={color} />
      <Path d="M2 12a10 10 0 0 1 18-6" stroke={color} />
      <Path d="M2 16h.01" stroke={color} />
      <Path d="M21.8 16c.2-2 .131-5.354 0-6" stroke={color} />
      <Path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" stroke={color} />
      <Path d="M8.65 22c.21-.66.45-1.32.57-2" stroke={color} />
      <Path d="M9 6.8a6 6 0 0 1 9 5.2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Fingerprint'

export const Fingerprint = memo<IconProps>(themed(Icon))
