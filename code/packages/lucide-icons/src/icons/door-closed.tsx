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

      <Path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" stroke={color} />
      <Path d="M2 20h20" stroke={color} />
      <Path d="M14 12v.01" stroke={color} />
    </Svg>);

};

Icon.displayName = 'DoorClosed';

export const DoorClosed = React.memo<IconProps>(themed(Icon));