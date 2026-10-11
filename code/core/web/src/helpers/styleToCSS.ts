import { defaultOffset } from './defaultOffset'
import { normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'

export function styleToCSS(style: Record<string, any>) {
  const { shadowOffset, shadowRadius, shadowColor, shadowOpacity } = style
  if (
    shadowRadius != null ||
    shadowColor ||
    shadowOffset != null ||
    shadowOpacity != null
  ) {
    const offset = shadowOffset || defaultOffset
    const width = normalizeValueWithProperty(offset.width)
    const height = normalizeValueWithProperty(offset.height)
    const radius = normalizeValueWithProperty(shadowRadius)
    const color = normalizeColor(shadowColor, shadowOpacity)
    if (color) {
      const shadow = `${width} ${height} ${radius} ${color}`
      style.boxShadow = style.boxShadow ? `${style.boxShadow}, ${shadow}` : shadow
    }
    delete style.shadowOffset
    delete style.shadowRadius
    delete style.shadowColor
    delete style.shadowOpacity
  }

  const { textShadowColor, textShadowOffset, textShadowRadius } = style
  if (textShadowColor || textShadowOffset || textShadowRadius) {
    const { height, width } = textShadowOffset || defaultOffset
    const radius = textShadowRadius || 0
    const color = normalizeValueWithProperty(textShadowColor, 'textShadowColor')
    if (color && (height !== 0 || width !== 0 || radius !== 0)) {
      const blurRadius = normalizeValueWithProperty(radius)
      const offsetX = normalizeValueWithProperty(width)
      const offsetY = normalizeValueWithProperty(height)
      style.textShadow = `${offsetX} ${offsetY} ${blurRadius} ${color}`
    }
    delete style.textShadowColor
    delete style.textShadowOffset
    delete style.textShadowRadius
  }
}
