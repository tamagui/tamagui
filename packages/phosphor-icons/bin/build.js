const fs = require('fs')
const glob = require('glob')
const camelcase = require('camelcase')
const uppercamelcase = require('uppercamelcase')
const path = require('path')
const cheerio = require('cheerio')
const prettier = require('prettier')

const rootDir = path.join(__dirname, '..')
const phosphorSvgsDir = path.join(rootDir, 'svgs')

const icons = glob.sync(`${phosphorSvgsDir}/*/**.svg`)

icons.forEach((i) => {
  const svg = fs.readFileSync(i, 'utf-8')
  const baseFolderName = path.basename(path.dirname(i)).toLowerCase()
  const id = `${path.basename(i, '.svg')}${
    baseFolderName === 'regular' ? '-regular' : ''
  }`

  const $ = cheerio.load(svg, {
    xmlMode: true,
  })
  const fileName = `${id}.tsx`
  const location = path.join(rootDir, 'src/icons', baseFolderName, fileName)

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

      if ($(el).attr('height') == null) {
        $(el).attr('heightSvg', 'heightSvg')
      }

      if ($(el).attr('width') == null) {
        $(el).attr('widthSvg', 'widthSvg')
      }

      /**
       * These two kinds of icons expect to be filled instead of stroked. To the caller, all they
       * have to pass is `color` and we handle the complexity here.
       */
      if (['duotone', 'fill'].includes(baseFolderName)) {
        $(el).attr('fillSvg', 'fillSvg')
      }
    }
  })

  const cname = uppercamelcase(id)

  const element = `
      import React, { memo } from 'react'
      import PropTypes from 'prop-types'
      import { IconProps } from '../../IconProps'
      import {
        Svg as _Svg,
        Circle as _Circle,
        Ellipse as _Ellipse,
        G as _G,
        LinearGradient as _LinearGradient,
        RadialGradient as _RadialGradient,
        Line as _Line,
        Path as _Path,
        Polygon as _Polygon,
        Polyline as _Polyline,
        Rect as _Rect,
        Symbol as _Symbol,
        Text as _Text,
        Use as _Use,
        Defs as _Defs,
        Stop as _Stop
      } from 'react-native-svg'
      import { themed } from '../../themed'

      const Icon = (props) => {
        const { color = 'black', size = 24, ...otherProps } = props
        return (
          ${$('svg')
            .toString()
            .replace(/ class=\"[^\"]+\"/g, '')
            .replace(new RegExp('stroke="currentColor"', 'g'), 'stroke={`${color}`}')
            .replace('width="24"', 'width={size}')
            .replace('height="24"', 'height={size}')
            .replace('widthSvg="widthSvg"', 'width={size}')
            .replace('heightSvg="heightSvg"', 'height={size}')
            .replace('otherProps="..."', '{...otherProps}')
            .replace('fillSvg="fillSvg"', 'fill={`${color}`}')
            .replace('<svg', '<_Svg')
            .replace('</svg', '</_Svg')
            .replace(new RegExp('<circle', 'g'), '<_Circle')
            .replace(new RegExp('</circle', 'g'), '</_Circle')
            .replace(new RegExp('<ellipse', 'g'), '<_Ellipse')
            .replace(new RegExp('</ellipse', 'g'), '</_Ellipse')
            .replace(new RegExp('<g', 'g'), '<_G')
            .replace(new RegExp('</g', 'g'), '</_G')
            .replace(new RegExp('<linear-gradient', 'g'), '<_LinearGradient')
            .replace(new RegExp('</linear-gradient', 'g'), '</_LinearGradient')
            .replace(new RegExp('<radial-gradient', 'g'), '<_RadialGradient')
            .replace(new RegExp('</radial-gradient', 'g'), '</_RadialGradient')
            .replace(new RegExp('<path', 'g'), '<_Path')
            .replace(new RegExp('</path', 'g'), '</_Path')
            .replace(new RegExp('<line', 'g'), '<_Line')
            .replace(new RegExp('</line', 'g'), '</_Line')
            .replace(new RegExp('<polygon', 'g'), '<_Polygon')
            .replace(new RegExp('</polygon', 'g'), '</_Polygon')
            .replace(new RegExp('<polyline', 'g'), '<_Polyline')
            .replace(new RegExp('</polyline', 'g'), '</_Polyline')
            .replace(new RegExp('<rect', 'g'), '<_Rect')
            .replace(new RegExp('</rect', 'g'), '</_Rect')
            .replace(new RegExp('<symbol', 'g'), '<_Symbol')
            .replace(new RegExp('</symbol', 'g'), '</_Symbol')
            .replace(new RegExp('<text', 'g'), '<_Text')
            .replace(new RegExp('</text', 'g'), '</_Text')
            .replace(new RegExp('<use', 'g'), '<_Use')
            .replace(new RegExp('</use', 'g'), '</_Use')
            .replace(new RegExp('<defs', 'g'), '<_Defs')
            .replace(new RegExp('</defs', 'g'), '</_Defs')
            .replace(new RegExp('<stop', 'g'), '<_Stop')
            .replace(new RegExp('</stop', 'g'), '</_Stop')
            .replace(new RegExp('px', 'g'), '')}
        )
      }

      Icon.displayName = '${cname}'

      export const ${cname} = memo<IconProps>(themed(Icon))
    `

  const component = prettier.format(element, {
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'always',
    plugins: [require.resolve('prettier-plugin-import-sort')],
    parser: 'typescript',
    semi: false,
  })

  const targetFolder = path.dirname(location)
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true })
  }

  fs.writeFileSync(location, component, 'utf-8')
})

/**
 * Once all icons for all weights have been created, glob over one of the folders to create
 * the true icons. This allows a user to supply a `weight` prop instead of needing to find
 * every icon weight they want.
 */
const regularIconsDirectory = path.join(rootDir, 'src/icons/regular')
glob(`${regularIconsDirectory}/**.tsx`, (err, icons) => {
  fs.writeFileSync(path.join(rootDir, 'src', 'index.ts'), '', 'utf-8')

  fs.appendFileSync(
    path.join(rootDir, 'src', 'index.ts'),
    `export * from './IconContext'
export * from './IconProps'\n`,
    'utf-8'
  )

  icons.forEach((i) => {
    const id = path.basename(i, '.tsx').replace('-regular', '')
    const fileName = `${id}.tsx`

    const location = path.join(rootDir, 'src/icons/icons', fileName)

    const cname = uppercamelcase(id)

    const element = `import { useContext } from 'react'
    import { ${cname}Regular } from '../regular/${id}-regular'
    import { ${cname}Bold } from '../bold/${id}-bold'
    import { ${cname}Duotone } from '../duotone/${id}-duotone'
    import { ${cname}Fill } from '../fill/${id}-fill'
    import { ${cname}Light } from '../light/${id}-light'
    import { ${cname}Thin } from '../thin/${id}-thin'
    import { IconProps } from '../../IconProps'
    import { IconContext } from '../../IconContext'

    const weightMap = {
      regular: ${cname}Regular,
      bold: ${cname}Bold,
      duotone: ${cname}Duotone,
      fill: ${cname}Fill,
      light: ${cname}Light,
      thin: ${cname}Thin,
    } as const
    
    export const ${cname} = (props: IconProps) => {
      const {
        color: contextColor,
        size: contextSize,
        weight: contextWeight,
        style: contextStyle,
      } = useContext(IconContext)

      const {
        color = contextColor ?? 'black',
        size = contextSize ?? 24,
        weight = contextWeight ?? 'regular',
        style = contextStyle ?? {},
        ...otherProps
      } = props

      const Component = weightMap[weight]
    
      return <Component color={color} size={size} weight={weight} style={style} {...otherProps} />
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

    const targetFolder = path.dirname(location)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true })
    }

    fs.writeFileSync(location, component, 'utf-8')

    const exportString = `export { ${cname} } from './icons/icons/${id}'\n`

    fs.appendFileSync(path.join(rootDir, 'src', 'index.ts'), exportString, 'utf-8')
  })
})
