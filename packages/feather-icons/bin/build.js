const fs = require('fs')
const glob = require('glob')
const camelcase = require('camelcase')
const uppercamelcase = require('uppercamelcase')
const path = require('path')
const cheerio = require('cheerio')
const prettier = require('prettier')
const featherDir = require.resolve('feather-icons')

const featherIconsDir = path.join(featherDir, '..', 'icons')
const rootDir = path.join(__dirname, '..')

glob(`${featherIconsDir}/**.svg`, (err, icons) => {
  fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), '', 'utf-8')

  icons.forEach((i) => {
    const svg = fs.readFileSync(i, 'utf-8')
    const id = path.basename(i, '.svg')
    const $ = cheerio.load(svg, {
      xmlMode: true,
    })
    const fileName = path.basename(i).replace('.svg', '.tsx')
    const location = path.join(rootDir, 'src/icons', fileName)

    // Because CSS does not exist on Native platforms
    // We need to duplicate the styles applied to the
    // SVG to its children
    const svgAttribs = $('svg')[0].attribs
    delete svgAttribs['xmlns']
    const attribsOfInterest = {}
    Object.keys(svgAttribs).forEach((key) => {
      if (key !== 'height' && key !== 'width' && key !== 'viewBox') {
        attribsOfInterest[key] = svgAttribs[key]
      }
    })
    $('*').each((index, el) => {
      Object.keys(el.attribs).forEach((x) => {
        if (x.includes('-')) {
          $(el).attr(camelcase(x), el.attribs[x]).removeAttr(x)
        }
        if (x === 'stroke') {
          $(el).attr(x, 'currentColor')
        }
      })

      // For every element that is NOT svg ...
      if (el.name !== 'svg') {
        Object.keys(attribsOfInterest).forEach((key) => {
          $(el).attr(camelcase(key), attribsOfInterest[key])
        })
      }

      if (el.name === 'svg') {
        $(el).attr('otherProps', '...')
      }
    })

    const element = `
      import React from 'react'
      import PropTypes from 'prop-types'
      import { IconProps } from '../IconProps'
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
        Text,
        Use,
        Defs,
        Stop
      } from 'react-native-svg'

      export const ${uppercamelcase(id)} = (props: IconProps) => {
        const { color = 'black', size = 24, ...otherProps } = props
        return (
          ${$('svg')
            .toString()
            .replace(/ class=\"[^\"]+\"/g, '')
            .replace(new RegExp('stroke="currentColor"', 'g'), 'stroke={color}')
            .replace('width="24"', 'width={size}')
            .replace('height="24"', 'height={size}')
            .replace('otherProps="..."', '{...otherProps}')
            .replace('<svg', '<Svg')
            .replace('</svg', '</Svg')
            .replace(new RegExp('<circle', 'g'), '<_Circle')
            .replace(new RegExp('</circle', 'g'), '</_Circle')
            .replace(new RegExp('<ellipse', 'g'), '<Ellipse')
            .replace(new RegExp('</ellipse', 'g'), '</Ellipse')
            .replace(new RegExp('<g', 'g'), '<G')
            .replace(new RegExp('</g', 'g'), '</G')
            .replace(new RegExp('<linear-gradient', 'g'), '<LinearGradient')
            .replace(new RegExp('</linear-gradient', 'g'), '</LinearGradient')
            .replace(new RegExp('<radial-gradient', 'g'), '<RadialGradient')
            .replace(new RegExp('</radial-gradient', 'g'), '</RadialGradient')
            .replace(new RegExp('<path', 'g'), '<Path')
            .replace(new RegExp('</path', 'g'), '</Path')
            .replace(new RegExp('<line', 'g'), '<Line')
            .replace(new RegExp('</line', 'g'), '</Line')
            .replace(new RegExp('<polygon', 'g'), '<Polygon')
            .replace(new RegExp('</polygon', 'g'), '</Polygon')
            .replace(new RegExp('<polyline', 'g'), '<Polyline')
            .replace(new RegExp('</polyline', 'g'), '</Polyline')
            .replace(new RegExp('<rect', 'g'), '<Rect')
            .replace(new RegExp('</rect', 'g'), '</Rect')
            .replace(new RegExp('<symbol', 'g'), '<Symbol')
            .replace(new RegExp('</symbol', 'g'), '</Symbol')
            .replace(new RegExp('<text', 'g'), '<Text')
            .replace(new RegExp('</text', 'g'), '</Text')
            .replace(new RegExp('<use', 'g'), '<Use')
            .replace(new RegExp('</use', 'g'), '</Use')
            .replace(new RegExp('<defs', 'g'), '<Defs')
            .replace(new RegExp('</defs', 'g'), '</Defs')
            .replace(new RegExp('<stop', 'g'), '<Stop')
            .replace(new RegExp('</stop', 'g'), '</Stop')
            .replace(new RegExp('px', 'g'), '')}
        )
      }
    `

    const component = prettier.format(element, {
      singleQuote: true,
      trailingComma: 'es5',
      arrowParens: 'always',
      plugins: [require.resolve('prettier-plugin-import-sort')],
      parser: 'typescript',
      semi: false,
    })

    fs.writeFileSync(location, component, 'utf-8')

    const cname = uppercamelcase(id)
    const exportString = `export { ${cname} } from './icons/${id}'\n`

    fs.appendFileSync(
      path.join(rootDir, 'src', 'index.ts'),
      exportString,
      'utf-8'
    )
  })
})
