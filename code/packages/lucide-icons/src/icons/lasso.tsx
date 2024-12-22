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
      <Path d="M7 22a5 5 0 0 1-2-4" stroke={color} />
      <Path
        d="M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1"
        stroke={color}
      />
      <Path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Lasso'

export const Lasso = memo<IconProps>(themed(Icon))
