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
        d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8"
        stroke={color}
      />
      <Path d="M2 14h20" stroke={color} />
      <Path d="M6 14v4" stroke={color} />
      <Path d="M10 14v4" stroke={color} />
      <Path d="M14 14v4" stroke={color} />
      <Path d="M18 14v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Piano'

export const Piano = memo<IconProps>(themed(Icon))
