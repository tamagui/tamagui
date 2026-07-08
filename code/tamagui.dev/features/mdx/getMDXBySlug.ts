import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import {
  getMDXBySlug as getMDXBySlugBase,
  getAllFrontmatter,
  getAllVersionsFromPath,
  type GetMDXOptions,
} from '@vxrn/mdx-rust'
import { highlightPlugin } from './highlightPlugin'

export { getAllFrontmatter, getAllVersionsFromPath }
export { getCompilationExamples } from './getCompilationExamples'

// resolve @tamagui/demos so `template=X` fences can inline the XDemo.tsx source.
// require.resolve gives dist/cjs/index.js, so go up 3 levels to the package root.
const requireFn =
  typeof require === 'undefined' ? createRequire(import.meta.url) : require
let demosPath = ''
try {
  const demosPackagePath = requireFn.resolve('@tamagui/demos')
  demosPath = path.join(demosPackagePath, '..', '..', '..')
} catch {
  // may fail in SSG worker context where node_modules aren't fully accessible
}

const templateRe = /\btemplate=(?:"([^"]*)"|'([^']*)'|([^"'\s]+))/

// satteri mdast plugin: inline the demo source for `template=X` hero fences.
// leaves node.meta untouched so highlightPlugin can still read line/hero/etc.
const heroTemplate = {
  name: 'tamagui-hero-template',
  code(node: any, ctx: any) {
    const meta: string = node.meta || ''
    const match = meta.match(templateRe)
    const templateName = match ? match[1] ?? match[2] ?? match[3] : undefined
    if (!templateName || !demosPath) return
    try {
      const source = fs.readFileSync(
        path.join(demosPath, 'src', `${templateName}Demo.tsx`),
        'utf8'
      )
      ctx.replaceNode(node, { ...node, value: source })
    } catch (err: any) {
      console.warn(`[tamagui-hero-template] ${templateName}:`, err.message)
    }
  },
}

function loadTransform(): (source: string) => string {
  try {
    // resolve through package.json so we always load the current `main` -
    // node caches the pkg's `main` field internally and HMR rebuilds of
    // @tamagui/to-tailwind would otherwise be invisible to the dev server.
    const pkgJsonPath = requireFn.resolve('@tamagui/to-tailwind/package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    const mainRel: string =
      pkg.exports?.['.']?.require || pkg.main || 'dist/cjs/index.cjs'
    const mainAbs = path.join(path.dirname(pkgJsonPath), mainRel)
    const mod = requireFn(mainAbs)
    if (mod?.tamaguiToTailwind) return mod.tamaguiToTailwind
  } catch (err) {
    console.warn(
      '[tailwind] failed to load @tamagui/to-tailwind:',
      (err as Error).message
    )
  }
  return (s: string) => s
}

const tailwindTransform = {
  name: 'tamagui-tailwind-transform',
  element: {
    filter: ['code'],
    visit(node: any, ctx: any) {
      const className = node.properties?.className
      if (!className) return

      const classes =
        typeof className === 'string'
          ? className.split(/\s+/)
          : Array.isArray(className)
            ? className
            : []
      const isJsx = classes.some(
        (c: string) =>
          c === 'language-tsx' ||
          c === 'language-jsx' ||
          c === 'language-ts' ||
          c === 'language-js'
      )
      if (!isJsx) return

      const source = ctx.textContent(node)
      if (!source || !source.includes('<') || !source.includes('>')) return

      try {
        const transform = loadTransform()
        const tailwindCode = transform(source)
        if (tailwindCode && tailwindCode !== source) {
          ctx.replaceNode(node, {
            ...node,
            children: [{ type: 'text', value: tailwindCode }],
          })
        }
      } catch {
        // transform failed, keep original
      }
    },
  },
}

type TamaguiGetMDXOptions = GetMDXOptions & {
  tailwind?: boolean
}

// tamagui.dev keeps its native <DocCodeBlock> (copy button, hero collapse, tabs),
// so we compile with satteri but skip Expressive Code and feed DocCodeBlock the
// same prism-tokenized output + meta props it got from the old rehype pipeline.
export const getMDXBySlug = (
  basePath: string,
  slug: string,
  options: TamaguiGetMDXOptions = {}
) => {
  const { tailwind, mdastPlugins, hastPlugins, ...rest } = options

  return getMDXBySlugBase(basePath, slug, {
    ...rest,
    expressiveCode: false,
    mdastPlugins: [heroTemplate, ...(mdastPlugins ?? [])],
    hastPlugins: [
      ...(tailwind ? [tailwindTransform] : []),
      highlightPlugin,
      ...(hastPlugins ?? []),
    ],
  } as GetMDXOptions)
}
