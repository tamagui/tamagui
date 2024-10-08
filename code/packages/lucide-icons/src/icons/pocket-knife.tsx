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
      <Path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" stroke={color} />
      <Path d="M18 6h.01" stroke={color} />
      <Path d="M6 18h.01" stroke={color} />
      <Path
        d="M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z"
        stroke={color}
      />
      <Path d="M18 11.66V22a4 4 0 0 0 4-4V6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PocketKnife'

export const PocketKnife = memo<IconProps>(themed(Icon))
