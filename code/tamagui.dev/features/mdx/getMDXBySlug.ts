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
function visitNodes(node: any, callback: (node: any) => void) {
  callback(node)
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      visitNodes(child, callback)
    }
  }
}

// Custom rehypeHeroTemplate that parses meta attribute directly
const metaRe = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

const rehypeHeroTemplate = () => {
  return (tree: any) => {
    visitNodes(tree, (node: any) => {
      if (node.type !== 'element' || node.tagName !== 'code') return

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

      if (!templateName && node.properties?.template) {
        templateName = node.properties.template
      }

      if (!templateName) return

      const templatePath = path.join(demosPath, 'src', `${templateName}Demo.tsx`)

      try {
        const source = fs.readFileSync(templatePath, 'utf8')

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

// ── tailwind transform ───────────────────────────────
// transforms JSX code blocks from tamagui syntax to tailwind className syntax
// applied as a rehype plugin when ?syntax=tailwind is in the URL

let tamaguiToTailwindFn: ((source: string) => string) | null = null

function loadTransform() {
  if (tamaguiToTailwindFn) return tamaguiToTailwindFn
  try {
    const mod = requireFn('@tamagui/to-tailwind')
    tamaguiToTailwindFn = mod.tamaguiToTailwind
  } catch (err) {
    console.warn('[tailwind] failed to load @tamagui/to-tailwind:', (err as Error).message)
    tamaguiToTailwindFn = (s: string) => s
  }
  return tamaguiToTailwindFn!
}

const rehypeTailwindTransform = () => {
  return (tree: any) => {
    visitNodes(tree, (node: any) => {
      if (node.type !== 'element' || node.tagName !== 'code') return

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

      const textNode = node.children?.[0]
      if (!textNode || textNode.type !== 'text' || !textNode.value) return
      const source = textNode.value

      if (!source.includes('<') || !source.includes('>')) return

      try {
        const transform = loadTransform()
        const tailwindCode = transform(source)
        if (tailwindCode && tailwindCode !== source) {
          textNode.value = tailwindCode
        }
      } catch {
        // transform failed, keep original
      }
    })
  }
}

// ── exports ──────────────────────────────────────────

export interface GetMDXOptions {
  tailwind?: boolean
}

export const getMDXBySlug = (
  basePath: string,
  slug: string,
  options?: GetMDXOptions
) => {
  const plugins = [rehypeHeroTemplate]

  // when tailwind mode is requested, add the transform plugin
  // this replaces JSX code block content with tailwind className syntax
  if (options?.tailwind) {
    plugins.push(rehypeTailwindTransform)
  }

  return getMDXBySlugBase(basePath, slug, plugins)
}
