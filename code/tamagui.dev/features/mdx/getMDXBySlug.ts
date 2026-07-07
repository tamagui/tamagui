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

// tamagui.dev keeps its native <DocCodeBlock> (copy button, hero collapse, tabs),
// so we compile with satteri but skip Expressive Code and feed DocCodeBlock the
// same prism-tokenized output + meta props it got from the old rehype pipeline.
export const getMDXBySlug: typeof getMDXBySlugBase = (basePath, slug, options) => {
  return getMDXBySlugBase(basePath, slug, {
    ...options,
    expressiveCode: false,
    mdastPlugins: [heroTemplate, ...(options?.mdastPlugins ?? [])],
    hastPlugins: [highlightPlugin, ...(options?.hastPlugins ?? [])],
  } as GetMDXOptions)
}
