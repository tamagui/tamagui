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
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" stroke={color} />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" stroke={color} />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke={color} />
      <Path d="M8 7v10" stroke={color} />
      <Path d="M12 7v10" stroke={color} />
      <Path d="M17 7v10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ScanBarcode'

export const ScanBarcode = memo<IconProps>(themed(Icon))
