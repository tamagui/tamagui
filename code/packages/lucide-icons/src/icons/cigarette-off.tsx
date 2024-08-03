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

      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
      <Path d="M12 12H2v4h14" stroke={color} />
      <Path d="M22 12v4" stroke={color} />
      <Path d="M18 12h-.5" stroke={color} />
      <Path d="M7 12v4" stroke={color} />
      <Path d="M18 8c0-2.5-2-2.5-2-5" stroke={color} />
      <Path d="M22 8c0-2.5-2-2.5-2-5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'CigaretteOff';

export const CigaretteOff = React.memo<IconProps>(themed(Icon));