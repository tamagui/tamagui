import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
        d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"
        stroke={color}
      />
      <Path d="m14 19 3 3v-5.5" stroke={color} />
      <Path d="m17 22 3-3" stroke={color} />
      <_Circle cx="9" cy="9" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ImageDown'

export const ImageDown: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
