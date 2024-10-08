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
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} />
      <Path d="M4 22h16" stroke={color} />
      <Path
        d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
        stroke={color}
      />
      <Path
        d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
        stroke={color}
      />
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Trophy'

export const Trophy = memo<IconProps>(themed(Icon))
