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
        d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"
        stroke={color}
      />
      <Path d="m18 2 4 4-4 4" stroke={color} />
      <Path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" stroke={color} />
      <Path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" stroke={color} />
      <Path d="m18 14 4 4-4 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Shuffle'

export const Shuffle = memo<IconProps>(themed(Icon))
