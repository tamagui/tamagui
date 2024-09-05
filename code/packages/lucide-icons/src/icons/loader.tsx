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

      <Line x1="12" x2="12" y1="2" y2="6" stroke={color} />
      <Line x1="12" x2="12" y1="18" y2="22" stroke={color} />
      <Line x1="4.93" x2="7.76" y1="4.93" y2="7.76" stroke={color} />
      <Line x1="16.24" x2="19.07" y1="16.24" y2="19.07" stroke={color} />
      <Line x1="2" x2="6" y1="12" y2="12" stroke={color} />
      <Line x1="18" x2="22" y1="12" y2="12" stroke={color} />
      <Line x1="4.93" x2="7.76" y1="19.07" y2="16.24" stroke={color} />
      <Line x1="16.24" x2="19.07" y1="7.76" y2="4.93" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Loader';

export const Loader = React.memo<IconProps>(themed(Icon));