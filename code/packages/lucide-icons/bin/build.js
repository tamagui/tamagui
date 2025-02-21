const fs = require('node:fs')
const glob = require('glob')
const camelcase = require('camelcase')
const uppercamelcase = require('uppercamelcase')
const path = require('node:path')
const cheerio = require('cheerio')
const lucideDir = require.resolve('lucide-static')

const lucideIconsDir = path.join(lucideDir, '..', '..', '..', 'icons')
const rootDir = path.join(__dirname, '..')
const outDir = path.join(rootDir, 'src/icons')

fs.mkdir(outDir, () => {})

let iconExports = []

glob(`${lucideIconsDir}/**.svg`, (err, icons) => {
  fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), '', 'utf-8')

  console.info(`Processing icons`, icons)

  icons.forEach((i) => {
    const svg = fs.readFileSync(i, 'utf-8')
    const id = path.basename(i, '.svg')
    const $ = cheerio.load(svg, {
      xmlMode: true,
    })
    const fileName = path.basename(i).replace('.svg', '.tsx')
    const location = path.join(outDir, fileName)

    // Because CSS does not exist on Native platforms
    // We need to duplicate the styles applied to the
    // SVG to its children
    const svgAttribs = $('svg')[0].attribs
    delete svgAttribs['xmlns']
    const attribsOfInterest = {}
    Object.keys(svgAttribs).forEach((key) => {
      if (
        ![
          'height',
          'width',
          'viewBox',
          'fill',
          'stroke-width',
          'stroke-linecap',
          'stroke-linejoin',
        ].includes(key)
      ) {
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

    const cname = uppercamelcase(id)

    const out = `
      import React, { memo } from 'react'
      import PropTypes from 'prop-types'
      import type { NamedExoticComponent } from 'react'
      import type { IconProps } from '@tamagui/helpers-icon'
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
        Stop
      } from 'react-native-svg'
      import { themed } from '@tamagui/helpers-icon'

      const Icon = (props) => {
        const { color = 'black', size = 24, ...otherProps } = props
        return (
          ${$('svg')
            .toString()
            .replace(/ class=\"[^\"]+\"/g, '')
            .replace(/ version=\"[^\"]+\"/g, '')
            .replace(/stroke="currentColor"/g, 'stroke={color}')
            .replace('width="24"', 'width={size}')
            .replace('height="24"', 'height={size}')
            .replace('otherProps="..."', '{...otherProps}')
            .replace('<svg', '<Svg')
            .replace('</svg', '</Svg')
            .replace(/<circle/g, '<_Circle')
            .replace(/<\/circle/g, '</_Circle')
            .replace(/<ellipse/g, '<Ellipse')
            .replace(/<\/ellipse/g, '</Ellipse')
            .replace(/<g/g, '<G')
            .replace(/<\/g/g, '</G')
            .replace(/<linear-gradient/g, '<LinearGradient')
            .replace(/<\/linear-gradient/g, '</LinearGradient')
            .replace(/<radial-gradient/g, '<RadialGradient')
            .replace(/<\/radial-gradient/g, '</RadialGradient')
            .replace(/<path/g, '<Path')
            .replace(/<\/path/g, '</Path')
            .replace(/<line/g, '<Line')
            .replace(/<\/line/g, '</Line')
            .replace(/<polygon/g, '<Polygon')
            .replace(/<\/polygon/g, '</Polygon')
            .replace(/<polyline/g, '<Polyline')
            .replace(/<\/polyline/g, '</Polyline')
            .replace(/<rect/g, '<Rect')
            .replace(/<\/rect/g, '</Rect')
            .replace(/<symbol/g, '<Symbol')
            .replace(/<\/symbol/g, '</Symbol')
            .replace(/<text/g, '<_Text')
            .replace(/<\/text/g, '</_Text')
            .replace(/<use/g, '<Use')
            .replace(/<\/use/g, '</Use')
            .replace(/<defs/g, '<Defs')
            .replace(/<\/defs/g, '</Defs')
            .replace(/<stop/g, '<Stop')
            .replace(/<\/stop/g, '</Stop')
            .replace(/px/g, '')}
        )
      }

      Icon.displayName = '${cname}'

      export const ${cname}: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
    `

    fs.writeFileSync(location, out, 'utf-8')

    iconExports.push(`export { ${cname} } from './icons/${id}'`)
  })
})

setTimeout(() => {
  fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), iconExports.join('\n'), 'utf-8')

  // run biome:
  require('child_process').execSync(`biome check --write src`)
}, 1000)
