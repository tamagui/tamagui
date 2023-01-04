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
      <_Path d="M129.5,94a8,8,0,0,1,.3-11.1L180.7,32A16,16,0,0,1,208,43.3V159.6a8,8,0,0,1-5.1,7.5,7.4,7.4,0,0,1-2.9.5,7.9,7.9,0,0,1-5.9-2.6Zm84.4,116.6-160-176a8,8,0,0,0-11.3-.5,7.9,7.9,0,0,0-.5,11.3L101.7,111,16,196.7A16,16,0,0,0,27.3,224H208a8.2,8.2,0,0,0,5.4-2.1A8,8,0,0,0,213.9,210.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'CellSignalSlashFill'

export const CellSignalSlashFill = memo<IconProps>(themed(Icon))
