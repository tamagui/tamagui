import { createElement, forwardRef } from 'react'

// react-native props that have no DOM spelling. react-native-svg's own web
// build runs props through react-native-web's createDOMProps, which performs
// this translation; without it these land on the svg element verbatim and
// React warns ("React does not recognize the testID prop on a DOM element").
const toDOMProps = (props) => {
  const { testID, accessibilityLabel, ...rest } = props
  if (testID !== undefined) rest['data-testid'] = testID
  if (accessibilityLabel !== undefined) rest['aria-label'] = accessibilityLabel
  return rest
}

const svgElement = (tag) =>
  forwardRef((props, ref) => createElement(tag, { ...toDOMProps(props), ref }))

export const Circle = svgElement('circle')
export const ClipPath = svgElement('clipPath')
export const Defs = svgElement('defs')
export const Ellipse = svgElement('ellipse')
export const ForeignObject = svgElement('foreignObject')
export const G = svgElement('g')
export const Image = svgElement('image')
export const Line = svgElement('line')
export const LinearGradient = svgElement('linearGradient')
export const Marker = svgElement('marker')
export const Mask = svgElement('mask')
export const Path = svgElement('path')
export const Pattern = svgElement('pattern')
export const Polygon = svgElement('polygon')
export const Polyline = svgElement('polyline')
export const RadialGradient = svgElement('radialGradient')
export const Rect = svgElement('rect')
export const Shape = svgElement('shape')
export const Stop = svgElement('stop')
export const Svg = svgElement('svg')
export const Symbol = svgElement('symbol')
export const Text = svgElement('text')
export const TextPath = svgElement('clipPath')
export const TSpan = svgElement('tSpan')
export const Use = svgElement('use')

export default Svg
