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
      <Path d="M8 7h8" stroke={color} />
      <Path d="M12 17.5 8 15h1a4 4 0 0 0 0-8" stroke={color} />
      <Path d="M8 11h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ReceiptIndianRupee'

export const ReceiptIndianRupee = memo<IconProps>(themed(Icon))
