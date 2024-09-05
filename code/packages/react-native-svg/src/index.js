import { createElement, forwardRef } from 'react'

export const Circle = forwardRef((p, ref) => createElement('circle', { ...p, ref }))
export const ClipPath = forwardRef((p, ref) => createElement('clipPath', { ...p, ref }))
export const Defs = forwardRef((p, ref) => createElement('defs', { ...p, ref }))
export const Ellipse = forwardRef((p, ref) => createElement('ellipse', { ...p, ref }))
export const ForeignObject = forwardRef((p, ref) =>
  createElement('foreignObject', { ...p, ref })
)
export const G = forwardRef((p, ref) => createElement('g', { ...p, ref }))
export const Image = forwardRef((p, ref) => createElement('image', { ...p, ref }))
export const Line = forwardRef((p, ref) => createElement('line', { ...p, ref }))
export const LinearGradient = forwardRef((p, ref) =>
  createElement('linearGradient', { ...p, ref })
)
export const Marker = forwardRef((p, ref) => createElement('marker', { ...p, ref }))
export const Mask = forwardRef((p, ref) => createElement('mask', { ...p, ref }))
export const Path = forwardRef((p, ref) => createElement('path', { ...p, ref }))
export const Pattern = forwardRef((p, ref) => createElement('pattern', { ...p, ref }))
export const Polygon = forwardRef((p, ref) => createElement('polygon', { ...p, ref }))
export const Polyline = forwardRef((p, ref) => createElement('polyline', { ...p, ref }))
export const RadialGradient = forwardRef((p, ref) =>
  createElement('radialGradient', { ...p, ref })
)
export const Rect = forwardRef((p, ref) => createElement('rect', { ...p, ref }))
export const Shape = forwardRef((p, ref) => createElement('shape', { ...p, ref }))
export const Stop = forwardRef((p, ref) => createElement('stop', { ...p, ref }))
export const Svg = forwardRef((p, ref) => createElement('svg', { ...p, ref }))
export const Symbol = forwardRef((p, ref) => createElement('symbol', { ...p, ref }))
export const Text = forwardRef((p, ref) => createElement('text', { ...p, ref }))
export const TextPath = forwardRef((p, ref) => createElement('clipPath', { ...p, ref }))
export const TSpan = forwardRef((p, ref) => createElement('tSpan', { ...p, ref }))
export const Use = forwardRef((p, ref) => createElement('use', { ...p, ref }))

export default Svg
