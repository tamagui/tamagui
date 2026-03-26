import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import {
  getMDXBySlug as getMDXBySlugBase,
  getAllFrontmatter,
  getAllVersionsFromPath,
} from '@vxrn/mdx'

export { getAllFrontmatter, getAllVersionsFromPath }
export { getCompilationExamples } from './getCompilationExamples'

// Resolve @tamagui/demos package location
// require.resolve gives us dist/cjs/index.js, so go up 3 levels to get package root
const requireFn =
  typeof require === 'undefined' ? createRequire(import.meta.url) : require
let demosPath = ''
try {
  const demosPackagePath = requireFn.resolve('@tamagui/demos')
  demosPath = path.join(demosPackagePath, '..', '..', '..')
} catch {
  // may fail in SSG worker context where node_modules aren't fully accessible
}

// Simple tree visitor that doesn't depend on unist-util-visit
// (Vite has issues with unist-util-visit ESM exports)
function visitNodes(node: any, callback: (node: any) => void) {
  callback(node)
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      visitNodes(child, callback)
    }
  }
}

// Custom rehypeHeroTemplate that parses meta attribute directly
// This is needed because extraPlugins run before rehypeMetaAttribute
const metaRe = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

const rehypeHeroTemplate = () => {
  return (tree: any) => {
    visitNodes(tree, (node: any) => {
      if (node.type !== 'element' || node.tagName !== 'code') return

      // Parse meta to get template property (before rehypeMetaAttribute runs)
      let templateName: string | undefined
      if (node.data?.meta) {
        metaRe.lastIndex = 0
        let match
        while ((match = metaRe.exec(node.data.meta))) {
          if (match[1] === 'template') {
            templateName = match[2] || match[3] || match[4] || ''
            break
          }
        }
      }

      // Also check properties in case rehypeMetaAttribute already ran
      if (!templateName && node.properties?.template) {
        templateName = node.properties.template
      }

      if (!templateName) return

      const templatePath = path.join(demosPath, 'src', `${templateName}Demo.tsx`)

      try {
        const source = fs.readFileSync(templatePath, 'utf8')

        // Handle case where code block has no children
        if (!node.children || node.children.length === 0) {
          node.children = [{ type: 'text', value: source }]
        } else if (node.children[0]) {
          node.children[0].value = source
        }
      } catch (err: any) {
        console.warn(
          `[rehypeHeroTemplate] Error loading template ${templateName}:`,
          err.message
        )
      }
    })
  }
}

// transform code blocks to tailwind syntax and store as data attribute
// runs after rehypeHeroTemplate so template-loaded code is also transformed
let tamaguiToTailwindFn: ((source: string) => string) | null = null

function getTamaguiToTailwind() {
  if (!tamaguiToTailwindFn) {
    try {
      const { tamaguiToTailwind } = requireFn('@tamagui/to-tailwind')
      tamaguiToTailwindFn = tamaguiToTailwind
    } catch {
      // package not available, skip transforms
      tamaguiToTailwindFn = () => ''
    }
  }
  return tamaguiToTailwindFn
}

const rehypeTailwindTransform = () => {
  return (tree: any) => {
    visitNodes(tree, (node: any) => {
      if (node.type !== 'element' || node.tagName !== 'code') return

      // only transform tsx/jsx code blocks
      const className = node.properties?.className
      if (!className) return
      const classes = Array.isArray(className) ? className : [className]
      const isJsx = classes.some(
        (c: string) =>
          c === 'language-tsx' ||
          c === 'language-jsx' ||
          c === 'language-ts' ||
          c === 'language-js'
      )
      if (!isJsx) return

      // get the raw source text
      const textNode = node.children?.[0]
      if (!textNode || textNode.type !== 'text' || !textNode.value) return
      const source = textNode.value

      // skip if it doesn't look like it has tamagui JSX
      if (!source.includes('<') || !source.includes('>')) return

      try {
        const transform = getTamaguiToTailwind()
        const tailwindCode = transform(source)
        if (tailwindCode && tailwindCode !== source) {
          node.properties = node.properties || {}
          node.properties['data-tailwind'] = tailwindCode
        }
      } catch {
        // transform failed, skip silently
      }
    })
  }
}

export const getMDXBySlug: typeof getMDXBySlugBase = (basePath, slug, extraPlugins) => {
  return getMDXBySlugBase(basePath, slug, [
    rehypeHeroTemplate,
    rehypeTailwindTransform,
    ...(extraPlugins || []),
  ])
}
