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
      <Path d="M21 14h-1.343" stroke={color} />
      <Path d="M9.128 3.47A9 9 0 0 1 21 12v3.343" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3" stroke={color} />
      <Path
        d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'HeadphoneOff'

export const HeadphoneOff = memo<IconProps>(themed(Icon))
