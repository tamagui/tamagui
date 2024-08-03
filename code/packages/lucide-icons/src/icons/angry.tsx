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

      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke={color} />
      <Path d="M7.5 8 10 9" stroke={color} />
      <Path d="m14 9 2.5-1" stroke={color} />
      <Path d="M9 10h0" stroke={color} />
      <Path d="M15 10h0" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Angry';

export const Angry = React.memo<IconProps>(themed(Icon));