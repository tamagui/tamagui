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
      <_Path d="M202.2,200.8a103.8,103.8,0,0,0,0-145.6,2.3,2.3,0,0,0-.7-.7,2.3,2.3,0,0,0-.7-.7,103.8,103.8,0,0,0-145.6,0,2.3,2.3,0,0,0-.7.7,2.3,2.3,0,0,0-.7.7,103.8,103.8,0,0,0,0,145.6l.7.7a2.3,2.3,0,0,0,.7.7,103.8,103.8,0,0,0,145.6,0,2.3,2.3,0,0,0,.7-.7A2.3,2.3,0,0,0,202.2,200.8ZM96,128a32,32,0,1,1,32,32A32.1,32.1,0,0,1,96,128Zm88.3-67.6L155.8,88.9a47.9,47.9,0,0,0-55.6,0L71.7,60.4a87.9,87.9,0,0,1,112.6,0ZM71.7,195.6l28.5-28.5a47.9,47.9,0,0,0,55.6,0l28.5,28.5a87.9,87.9,0,0,1-112.6,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'LifebuoyFill'

export const LifebuoyFill = memo<IconProps>(themed(Icon))
