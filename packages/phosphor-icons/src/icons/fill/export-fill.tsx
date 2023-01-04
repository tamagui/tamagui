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
      <_Path d="M136,88H120V35.3L91.7,63.6A8,8,0,0,1,80.3,52.3l42-42a8.1,8.1,0,0,1,11.4,0l42,42a8,8,0,0,1,0,11.3,8,8,0,0,1-11.4,0L136,35.3Zm64,0H136v40a8,8,0,0,1-16,0V88H56a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V104A16,16,0,0,0,200,88Z" />
    </_Svg>
  )
}

Icon.displayName = 'ExportFill'

export const ExportFill = memo<IconProps>(themed(Icon))
