const fs = require('fs-extra')
const { globSync } = require('glob')
const camelcase = require('camelcase')
const uppercamelcase = require('uppercamelcase')
const path = require('node:path')
const cheerio = require('cheerio')
const lucideDir = require.resolve('lucide-static')

const lucideIconsDir = path.join(lucideDir, '..', '..', '..', 'icons')
const rootDir = path.join(__dirname, '..')
const outDir = path.join(rootDir, 'src/icons')

// icons that shadow global JS names need eslint-disable
const shadowsGlobalNames = ['Infinity', 'NaN', 'undefined']

function createAlignedExport(basePath) {
  return {
    'react-native': basePath.replace('.mjs', '.native.js'),
    browser: basePath,
    module: basePath,
    import: basePath,
    require: basePath.replace('/esm/', '/cjs/').replace('.mjs', '.cjs'),
    default: basePath,
  }
}

console.info(`Scanning`, lucideIconsDir)

fs.mkdir(outDir, () => {})

let iconExports = []
const packageJsonExports = {}

const icons = globSync(`${lucideIconsDir}/*.svg`)
fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), '', 'utf-8')

console.info(`Processing icons`, icons.length)

const backwardsCompat = fs.readdirSync('./backwards-compat')

backwardsCompat.forEach((filePath) => {
  let out = fs.readFileSync('./backwards-compat/' + filePath, 'utf-8').trim()
  const name = uppercamelcase(path.basename(filePath).replace(/\..*/, ''))

  if (filePath.endsWith('svg-part')) {
    //
  } else {
    out = out.slice(out.search(/<Svg/g))
    out = out.slice(0, out.search(/<\/Svg>.*/g)) + '</Svg>'
  }

  const outLocation = `./src/icons/${name}.tsx`
  fs.writeFileSync(outLocation, wrapReact(name, out), 'utf-8')

  iconExports.push(`export { ${name} } from './icons/${name}'`)
  packageJsonExports[`./icons/${name}`] = createAlignedExport(
    `./dist/esm/icons/${name + '.mjs'}`
  )
})

icons.forEach((originalName) => {
  const svg = fs.readFileSync(originalName, 'utf-8')
  const id = path.basename(originalName, '.svg')
  const $ = cheerio.load(svg, {
    xmlMode: true,
  })

  const cname = uppercamelcase(id)
  const fileName = cname + '.tsx'
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

  const out = wrapReact(
    cname,
    $('svg')
      .toString()
      .replace(/ class="[^"]+"/g, '')
      .replace(/ version="[^"]+"/g, '')
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
      .replace(new RegExp('<text', 'g'), '<_Text')
      .replace(new RegExp('</text', 'g'), '</_Text')
      .replace(new RegExp('<use', 'g'), '<Use')
      .replace(new RegExp('</use', 'g'), '</Use')
      .replace(new RegExp('<defs', 'g'), '<Defs')
      .replace(new RegExp('</defs', 'g'), '</Defs')
      .replace(new RegExp('<stop', 'g'), '<Stop')
      .replace(new RegExp('</stop', 'g'), '</Stop')
      .replace(new RegExp('px', 'g'), '')
  )

  fs.writeFileSync(location, out, 'utf-8')

  iconExports.push(`export { ${cname} } from './icons/${fileName.replace('.tsx', '')}'`)

  packageJsonExports[`./icons/${fileName.replace('.tsx', '')}`] = createAlignedExport(
    `./dist/esm/icons/${fileName.replace('.tsx', '.mjs')}`
  )
})

setTimeout(() => {
  const pkgJson = fs.readJSONSync('package.json')
  pkgJson.exports = {
    ...Object.fromEntries(
      Object.entries(pkgJson.exports).flatMap((entry) => {
        if (entry[0].startsWith('./icon')) {
          return []
        }
        return [entry]
      })
    ),
    ...packageJsonExports,
  }

  fs.writeJSONSync('package.json', pkgJson, {
    spaces: 2,
  })

  fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), iconExports.join('\n'), 'utf-8')

  // keep generated files aligned with repo tooling (OXC)
  require('child_process').execSync(`bunx oxfmt src`, { stdio: 'inherit' })
  require('child_process').execSync(`bunx oxlint --fix --fix-suggestions src`, {
    stdio: 'inherit',
  })
}, 1000)

function wrapReact(name, contents) {
  const eslintDisable = shadowsGlobalNames.includes(name)
    ? '/* eslint-disable no-shadow-restricted-names */\n'
    : ''
  return `// @ts-nocheck
${eslintDisable}import React, { memo } from 'react'
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

    type IconComponent = (propsIn: IconProps) => JSX.Element
    
    export const ${name}: IconComponent = themed(memo(function ${name}(props: IconProps) {
      const { color = 'black', size = 24, ...otherProps } = props
      return (
       ${contents}
      )
    }))
      `
}
