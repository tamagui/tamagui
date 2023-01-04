import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M248,132a56,56,0,0,0-32-50.6V72a48,48,0,0,0-88-26.5A48,48,0,0,0,40,72v9.4a56,56,0,0,0,0,101.2V184a48,48,0,0,0,88,26.5A48,48,0,0,0,216,184v-1.4A56.1,56.1,0,0,0,248,132ZM88,216a32,32,0,0,1-31.8-28.6,49.3,49.3,0,0,0,7.8.6h8a8,8,0,0,0,0-16H64A40,40,0,0,1,50.7,94.3,8.1,8.1,0,0,0,56,86.7V72a32,32,0,0,1,64,0v76.3A47.4,47.4,0,0,0,88,136a8,8,0,0,0,0,16,32,32,0,0,1,0,64Zm104-44h-8a8,8,0,0,0,0,16h8a49.3,49.3,0,0,0,7.8-.6A32,32,0,1,1,168,152a8,8,0,0,0,0-16,47.4,47.4,0,0,0-32,12.3V72a32,32,0,0,1,64,0V86.7a8.1,8.1,0,0,0,5.3,7.6A40,40,0,0,1,192,172ZM60,128a8,8,0,0,1,0-16A20.1,20.1,0,0,0,80,92V84a8,8,0,0,1,16,0v8A36,36,0,0,1,60,128Zm144-8a8,8,0,0,1-8,8,36,36,0,0,1-36-36V84a8,8,0,0,1,16,0v8a20.1,20.1,0,0,0,20,20A8,8,0,0,1,204,120Z" />
    </_Svg>
  )
}

Icon.displayName = 'BrainFill'

export const BrainFill = memo<IconProps>(themed(Icon))
