import { createStore } from '@tamagui/use-store'
import { keyBy, uniqueId } from 'lodash-es'
import { cssColorNames } from '../colors/cssColorNames'
import { hexToColor, randomIntegerInRange } from '~/features/studio/colors/helpers'
import { colorToHex, getColor } from '~/features/studio/colors/helpers'
import { rootStore } from './RootStore'
import type { Color, Curve, Palette, Scale } from './types'

// accounts for negative
export const getColorFromOffset = (colors: Color[], offset: number) => {
  const next = colors[offset < 0 ? colors.length + offset - 1 : offset]
  if (!next) {
    return colors[0]
  }
  return next
}

export class ColorsStore {
  scheme = ''
  scaleId = ''
  curveId = ''
  selectedIndex = '0'
  palettesByScheme: Record<string, Palette> = {}
  past: Record<string, Palette>[] = []
  future: Record<string, Palette>[] = []

  // temporary until we change history of edits
  hasChanges = false
  initialized = false

  get palette() {
    return this.palettesByScheme[this.scheme]
  }

  setPalette(name: string) {
    const [scheme, ...names] = name.split('_')
    this.setScheme(scheme, names.length ? names.join('_') : undefined)
  }

  // this somewhat awkward api because were still converting this over from githubs palette builder
  setScheme(schemeId: string, paletteId?: string) {
    this.scheme = schemeId
    this.setScale(paletteId ?? Object.keys(this.palette.scales)[0])
  }

  init() {
    if (this.initialized) return
    this.createPalettes()
    this.initialized = true
  }

  resetState() {
    this.createPalettes()
    this.hasChanges = false
  }

  createPalettes() {
    if (!rootStore.themes || !rootStore.config) {
      console.warn('Config not loaded yet.')
      return
    }

    const colorTokens = rootStore.config.tokens.color
    const palettes = rootStore.themes.palettes

    const res: Record<string, Record<string, string[]>> = {}

    if (!colorTokens) return

    for (const key in palettes) {
      const [scheme, ...names] = key.split('_')
      const name = names.join('_')
      res[scheme] ??= {}
      res[scheme][name || scheme] = palettes[key]
    }

    function themeColorsToScale(name: string, colors: string[]): Scale {
      const colorsArray = Array.isArray(colors) ? colors : [colors]
      return {
        name,
        colors: colorsArray.map((color) => {
          return {
            ...hexToColor(color),
            originalValue: color,
          }
        }),
        originalValues: colorsArray,
        curves: {},
      }
    }

    const lightPaletteId = 'light'
    const lightScales: Scale[] = Object.entries(res.light).map(([name, colors]) =>
      themeColorsToScale(name, colors as string[])
    )

    const darkPaletteId = 'dark'
    const darkScales: Scale[] = Object.entries(res.dark).map(([name, colors]) =>
      themeColorsToScale(name, colors as string[])
    )

    this.palettesByScheme = {
      [lightPaletteId]: {
        ...this.palettesByScheme.light,
        id: lightPaletteId,
        name: 'Light',
        backgroundColor: 'transparent',
        scales: keyBy(lightScales, 'name'),
        curves: {},
      },
      [darkPaletteId]: {
        ...this.palettesByScheme.dark,
        id: darkPaletteId,
        name: 'Dark',
        backgroundColor: 'transparent',
        scales: keyBy(darkScales, 'name'),
        curves: {},
      },
    }

    this.setPalette(rootStore.theme === 'dark' ? darkScales[0].name : lightScales[0].name)
  }

  setScale(id: string) {
    const scale = this.palette.scales[id ?? this.scheme]
    if (!scale) {
      throw new Error(`Scale with id ${id} does not exist.`)
    }
    this.changeIndexIfOutOfRange(scale.colors.length)
    this.scaleId = id
  }

  changeIndexIfOutOfRange(newScaleLength: number) {
    // edge case when prev scale had more colors than new one and selected index is out of range
    // e.g. palette 1, color 10 was selected -> user selects palette 2 with 5 colors -> error

    this.selectedIndex = Math.min(
      newScaleLength - 1,
      Number(this.selectedIndex)
    ).toString()
  }

  get scale() {
    return this.palette?.scales[this.scaleId]
  }

  updateScale(id: string, next: Scale) {
    this.palette.scales[id] = next
    this.updateCurrentPalette()
  }

  updateCurrentScale(next: Scale = this.scale) {
    this.updateScale(this.scaleId, next)
  }

  getScale(name: string) {
    // find it
    const [scheme, ...names] = name.split('_')
    const scaleName = names.join('_')
    const found = this.palettesByScheme[scheme]?.scales[scaleName]
    //
    if (found) {
      return found
    }

    const pal = this.palette
    for (const key in pal.scales) {
      if (pal.scales[key].name === name) return pal.scales[key]
    }
  }

  curve(id?: string) {
    return this.palette?.curves[id ?? this.curveId]
  }

  get focusedHex() {
    let val: string | undefined
    const index = this.selectedIndex
    const palette = this.palette
    const scale = this.scale
    try {
      const color = index
        ? getColor(palette.curves, scale, parseInt(index, 10))
        : undefined
      val = color ? colorToHex(color) : undefined
    } catch (error) {}
    return val
  }

  updatePalette(id: string, next: Palette) {
    this.hasChanges = true

    this.palettesByScheme = {
      ...this.palettesByScheme,
      [id]: next,
    }
  }

  updateCurrentPalette(next: Palette = this.palette) {
    this.updatePalette(this.scheme, next)
  }

  setBackgroundColor(value: string) {
    this.palette.backgroundColor = value
    this.updateCurrentPalette()
  }

  createScale() {
    const randomIndex = randomIntegerInRange(0, cssColorNames.length)
    const name = `${cssColorNames[randomIndex]}_${uniqueId()}`
    const color = hexToColor(name)
    this.palette.scales[name] = {
      name,
      colors: [color],
      originalValues: [name],
      curves: {},
    }
    this.updateCurrentPalette()
    // pushUndo()
  }

  setColorIndex(index: string) {
    this.selectedIndex = index
    // pushUndo()
  }

  createColor() {
    const { colors } = this.scale
    let color = { ...colors[colors.length - 1] }
    if (!color) {
      const randomIndex = randomIntegerInRange(0, cssColorNames.length)
      const name = cssColorNames[randomIndex]
      color = hexToColor(name)
    } else {
      color.lightness = Math.max(0, color.lightness - 10)
    }
    colors.push(color)
    this.updateCurrentScale()
    // pushUndo()
  }

  popColor() {
    this.scale.colors.pop()
    this.changeIndexIfOutOfRange(this.scale.colors.length)
    this.updateCurrentScale()
    // pushUndo()
  }

  deleteColor(index: number) {
    this.scale.colors.splice(index, 1)
    this.changeIndexIfOutOfRange(this.scale.colors.length)
    this.updateCurrentScale()
    // pushUndo()
  }

  changeColorValue({ index, value }: { index: number; value: Partial<Color> }) {
    Object.assign(this.scale.colors[index], value)
    this.updateCurrentScale()
    // pushUndo()
  }

  changeScaleCurve({
    curveType,
    curveId,
  }: {
    curveType: Curve['type']
    curveId: string
  }) {
    const palette = this.palette
    const scale = this.scale

    // Update color values
    if (curveId) {
      scale.colors = scale.colors.map((color) => ({
        ...color,
        [curveType]: 0,
      }))

      scale.curves[curveType] = curveId
    } else {
      scale.colors = scale.colors.map((color, index) => ({
        ...color,
        [curveType]: getColor(palette.curves, scale, index)[curveType],
      }))
      delete scale.curves[curveType]
    }

    this.updateCurrentPalette(palette)
    // pushUndo()
  }

  changeScaleColors(colors: Scale['colors']) {
    this.scale.colors = colors
    this.updateCurrentScale()
    // pushUndo()
  }

  changeCurveValues({ values, curveId }: { curveId: string; values: Curve['values'] }) {
    this.palette.curves[curveId].values = values
    this.updateCurrentPalette()
    // pushUndo()
  }

  changeScaleName(name: string) {
    this.scale.name = name
    this.updateCurrentScale()
    // pushUndo()
  }

  deleteScale() {
    delete this.palette.scales[this.scaleId]
    this.updateCurrentPalette()
    // pushUndo()
  }

  createCurveFromScale(curveType: Curve['type']) {
    // Create curve
    const curveId = uniqueId()
    const palette = this.palette
    const scale = this.scale
    const values = scale.colors
      .map((_, index) => getColor(palette.curves, scale, index))
      .map((color) => color[curveType])

    palette.curves[curveId] = {
      id: curveId,
      name: `${scale.name} ${curveType}`,
      type: curveType,
      values,
    }

    // Add curve id to scale
    this.scale.curves[curveType] = curveId

    // Reset color offsets
    this.scale.colors = scale.colors.map((color) => ({
      ...color,
      [curveType]: 0,
    }))

    this.updateCurrentPalette()
    this.updateCurrentScale()
    // pushUndo()
  }

  changeCurveName(name: string) {
    this.curve().name = name
    // pushUndo()
  }

  deleteCurve() {
    // Find and remove references to curve
    const palette = this.palette
    Object.values(palette.scales).forEach((scale) => {
      ;(Object.entries(scale.curves) as [Curve['type'], string | undefined][]).forEach(
        ([type, curveId]) => {
          // wtf is oging on here
          // biome-ignore lint/nursery/noConstantCondition: <explanation>
          if (true) {
            // if (curveId === curveId) {
            // Update color values
            scale.colors = scale.colors.map((color, index) => ({
              ...color,
              [type]: this.curve().values[index] + color[type],
            }))

            // Delete curve from scale
            delete scale.curves[type]
          }
        }
      )
    })

    // Delete curve
    delete palette.curves[this.curveId]
    this.updateCurrentPalette()
    // pushUndo()
  }

  changeCurveValue({ index, value }: { index: number; value: number }) {
    this.curve().values[index] = value
    this.updateCurrentPalette()
    // pushUndo()
  }

  changePaletteBackgroundColor(backgroundColor: string) {
    this.palette.backgroundColor = backgroundColor
    // pushUndo()
    this.updateCurrentPalette()
  }

  importScales({ replace, scales }: { scales: Record<string, Scale>; replace: boolean }) {
    if (replace) {
      this.palette.scales = scales
    } else {
      Object.assign(this.palette.scales, scales)
    }
    this.updateCurrentPalette()
    // pushUndo()
  }
}

export const colorsStore = createStore(ColorsStore)
