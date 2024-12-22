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
      <Path d="m12 10 3-3" stroke={color} />
      <Path d="m9 7 3 3v7.5" stroke={color} />
      <Path d="M9 11h6" stroke={color} />
      <Path d="M9 15h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ReceiptJapaneseYen'

export const ReceiptJapaneseYen = memo<IconProps>(themed(Icon))
