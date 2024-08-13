import React from "react";
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
      <Path d="M20.83 14.83a4 4 0 0 0 0-5.66" stroke={color} />
      <Path d="M18 12h.01" stroke={color} />
    </Svg>);

};

Icon.displayName = 'BluetoothSearching';

export const BluetoothSearching = React.memo<IconProps>(themed(Icon));