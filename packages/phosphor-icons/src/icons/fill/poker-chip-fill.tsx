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
      <_Path d="M202.2,200.8a103.8,103.8,0,0,0,0-145.6,2.3,2.3,0,0,0-.7-.7,2.3,2.3,0,0,0-.7-.7,103.8,103.8,0,0,0-145.6,0,2.3,2.3,0,0,0-.7.7,2.3,2.3,0,0,0-.7.7,103.8,103.8,0,0,0,0,145.6l.7.7a2.3,2.3,0,0,0,.7.7,103.8,103.8,0,0,0,145.6,0,2.3,2.3,0,0,0,.7-.7A2.3,2.3,0,0,0,202.2,200.8ZM40.4,136H64.5a63.6,63.6,0,0,0,13,31.2L60.4,184.3A87.5,87.5,0,0,1,40.4,136Zm20-64.3L77.5,88.8a63.6,63.6,0,0,0-13,31.2H40.4A87.5,87.5,0,0,1,60.4,71.7ZM215.6,120H191.5a63.6,63.6,0,0,0-13-31.2l17.1-17.1A87.5,87.5,0,0,1,215.6,120ZM167.2,77.5a63.6,63.6,0,0,0-31.2-13V40.4a87.5,87.5,0,0,1,48.3,20ZM120,64.5a63.6,63.6,0,0,0-31.2,13L71.7,60.4a87.5,87.5,0,0,1,48.3-20Zm-31.2,114a63.6,63.6,0,0,0,31.2,13v24.1a87.5,87.5,0,0,1-48.3-20Zm47.2,13a63.6,63.6,0,0,0,31.2-13l17.1,17.1a87.5,87.5,0,0,1-48.3,20Zm42.5-24.3a63.6,63.6,0,0,0,13-31.2h24.1a87.5,87.5,0,0,1-20,48.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'PokerChipFill'

export const PokerChipFill = memo<IconProps>(themed(Icon))
