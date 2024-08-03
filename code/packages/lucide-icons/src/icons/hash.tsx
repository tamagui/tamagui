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

      <Line x1="4" x2="20" y1="9" y2="9" stroke={color} />
      <Line x1="4" x2="20" y1="15" y2="15" stroke={color} />
      <Line x1="10" x2="8" y1="3" y2="21" stroke={color} />
      <Line x1="16" x2="14" y1="3" y2="21" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Hash';

export const Hash = React.memo<IconProps>(themed(Icon));