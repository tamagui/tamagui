import * as React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
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
      {...otherProps}>

      <Path d="m7 7 10 10-5 5V2l5 5L7 17" stroke={color} />
      <Line x1="18" x2="21" y1="12" y2="12" stroke={color} />
      <Line x1="3" x2="6" y1="12" y2="12" stroke={color} />
    </Svg>);

};

Icon.displayName = 'BluetoothConnected';

export const BluetoothConnected = React.memo<IconProps>(themed(Icon));