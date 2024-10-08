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
      <Path
        d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"
        stroke={color}
      />
      <Path d="M8 13h5" stroke={color} />
      <Path d="M10 17V9.5a2.5 2.5 0 0 1 5 0" stroke={color} />
      <Path d="M8 17h7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ReceiptPoundSterling'

export const ReceiptPoundSterling = memo<IconProps>(themed(Icon))
