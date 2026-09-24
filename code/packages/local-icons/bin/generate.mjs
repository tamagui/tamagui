#!/usr/bin/env node
// Generates themed Tamagui icon components from lucide svg files.
// In-repo this regenerates exactly the set in icons.json; give icon names as
// arguments to generate a subset instead:
//
//   node ./bin/generate.mjs                    # regenerate icons.json set
//   node ./bin/generate.mjs Search X Plus      # generate a subset
//
// The same script is the documented v3 user path: copy it plus
// backwards-compat/ into your app, list the icons you use, and run it.
// Needs `lucide-static` and `cheerio` resolvable (devDependencies here).
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(rootDir, 'src', 'icons')
const require = createRequire(import.meta.url)

// icons that shadow global JS names need eslint-disable
const shadowsGlobalNames = ['Infinity', 'NaN', 'undefined']

const camelCase = (x) => x.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
const upperCamelCase = (id) =>
  id
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join('')

// the lucide svgs live in icons/ at the lucide-static package root
function findLucideIconsDir() {
  const candidates = []
  try {
    candidates.push(
      path.join(path.dirname(require.resolve('lucide-static/package.json')), 'icons')
    )
  } catch {
    // not resolvable through package.json, try the main entry below
  }
  try {
    const main = require.resolve('lucide-static')
    candidates.push(path.join(main, '..', '..', '..', 'icons'))
  } catch {
    // lucide-static is not installed, candidates stays empty
  }
  for (const dir of candidates) {
    if (existsSync(dir)) return dir
  }
  throw new Error(
    `cannot find lucide-static icons dir (tried ${candidates.join(', ')}). install lucide-static next to this script.`
  )
}

async function main() {
  const { load: cheerioLoad } = await import('cheerio').catch(() => {
    throw new Error('cannot find cheerio. install it next to this script.')
  })

  const lucideIconsDir = findLucideIconsDir()
  console.info(`Scanning`, lucideIconsDir)

  // wanted names: argv subset, else the checked-in icons.json set
  const fromArgv = process.argv.slice(2).filter(Boolean)
  const wanted = fromArgv.length
    ? [...new Set(fromArgv)]
    : JSON.parse(readFileSync(path.join(rootDir, 'icons.json'), 'utf-8'))
  console.info(`Wanted icons`, wanted.length)

  // every lucide svg by PascalCase name
  const svgByName = new Map()
  for (const file of readdirSync(lucideIconsDir)) {
    if (!file.endsWith('.svg')) continue
    svgByName.set(
      upperCamelCase(file.slice(0, -'.svg'.length)),
      path.join(lucideIconsDir, file)
    )
  }

  // backwards-compat keeps old lucide names that no longer ship svgs:
  // .svg-part files hold raw svg children, .tsx files hold full old components
  const compatDir = path.join(rootDir, 'backwards-compat')
  const compatByName = new Map()
  if (existsSync(compatDir)) {
    for (const file of readdirSync(compatDir)) {
      if (file.endsWith('.svg-part')) {
        compatByName.set(file.slice(0, -'.svg-part'.length), path.join(compatDir, file))
      } else if (file.endsWith('.tsx')) {
        compatByName.set(
          upperCamelCase(file.slice(0, -'.tsx'.length)),
          path.join(compatDir, file)
        )
      }
    }
  }

  const missing = wanted.filter((name) => !svgByName.has(name) && !compatByName.has(name))
  if (missing.length) {
    throw new Error(
      `unknown icon names (no lucide svg or backwards-compat entry): ${missing.join(', ')}`
    )
  }

  mkdirSync(outDir, { recursive: true })

  const iconExports = []
  for (const name of wanted) {
    if (compatByName.has(name)) {
      const filePath = compatByName.get(name)
      let out = readFileSync(filePath, 'utf-8').trim()
      if (!filePath.endsWith('svg-part')) {
        out = out.slice(out.search(/<Svg/g))
        out = out.slice(0, out.search(/<\/Svg>.*/g)) + '</Svg>'
      }
      writeFileSync(path.join(outDir, `${name}.tsx`), wrapReact(name, out), 'utf-8')
    } else {
      const svg = readFileSync(svgByName.get(name), 'utf-8')
      const $ = cheerioLoad(svg, { xmlMode: true })

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
            $(el).attr(camelCase(x), el.attribs[x]).removeAttr(x)
          }
          if (x === 'stroke') {
            $(el).attr(x, 'currentColor')
          }
        })

        // For every element that is NOT svg ...
        if (el.name !== 'svg') {
          Object.keys(attribsOfInterest).forEach((key) => {
            $(el).attr(camelCase(key), attribsOfInterest[key])
          })
        }

        if (el.name === 'svg') {
          $(el).attr('otherProps', '...')
        }
      })

      const out = wrapReact(
        name,
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

      writeFileSync(path.join(outDir, `${name}.tsx`), out, 'utf-8')
    }

    iconExports.push(`export { ${name} } from './icons/${name}'`)
    console.info(`Generated`, name)
  }

  writeFileSync(path.join(rootDir, 'src', 'index.ts'), iconExports.join('\n'), 'utf-8')

  // a name -> component map of the generated set. it lives apart from the
  // index so that importing a handful of icons never retains the whole set:
  // a bundler that sees `Object.keys(ns)` on the index has to keep all of
  // them. only reach this through a dynamic import().
  writeFileSync(
    path.join(rootDir, 'src', 'all.ts'),
    `/* eslint-disable no-shadow-restricted-names */
import type { IconProps } from '@tamagui/helpers-icon'
${wanted.map((name) => `import { ${name} } from './icons/${name}'`).join('\n')}

export const allIcons: Record<string, (props: IconProps) => any> = {
${wanted.map((name) => `  ${name},`).join('\n')}
}
`,
    'utf-8'
  )

  // warn about generated files that are no longer wanted, so the set stays exact
  if (!fromArgv.length) {
    const wantedSet = new Set(wanted)
    const stale = readdirSync(outDir)
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => f.slice(0, -'.tsx'.length))
      .filter((name) => !wantedSet.has(name))
    for (const name of stale) {
      console.warn(`Stale generated icon (not in icons.json): ${name}.tsx`)
    }
  }

  // keep generated files aligned with repo tooling (OXC)
  for (const cmd of [`bunx oxfmt src`, `bunx oxlint --fix --fix-suggestions src`]) {
    try {
      execSync(cmd, { stdio: 'inherit', cwd: rootDir })
    } catch {
      console.warn(`Skipping \`${cmd}\`: not available next to this script.`)
    }
  }
}

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

await main()
