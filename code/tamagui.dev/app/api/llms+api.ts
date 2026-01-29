import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { apiRoute } from '~/features/api/apiRoute'

// component descriptions for llms.txt
const componentDescriptions: Record<string, string> = {
  accordion: 'Expandable content sections',
  'alert-dialog': 'Modal dialog for important actions',
  anchor: 'Link component with styling options',
  avatar: 'User avatar display component',
  button: 'A customizable button component with variants and themes',
  card: 'Container component for grouped content',
  checkbox: 'Selection control component',
  dialog: 'Modal dialog component',
  form: 'Form components and validation',
  group: 'Component grouping utilities',
  headings: 'Typography heading components',
  'html-elements': 'Basic HTML element components',
  image: 'Image display component',
  inputs: 'Text input components',
  label: 'Accessible label components',
  'linear-gradient': 'Gradient background component',
  'list-item': 'List item component',
  'lucide-icons': 'Icon component library',
  'new-inputs': 'Enhanced input components',
  popover: 'Floating content component',
  portal: 'Render content in different DOM locations',
  progress: 'Progress indicators',
  'radio-group': 'Radio button selection group',
  'scroll-view': 'Scrollable container component',
  select: 'Dropdown selection component',
  separator: 'Visual separators',
  shapes: 'Basic shape components',
  sheet: 'Bottom sheet and modal components',
  slider: 'Range input components',
  spinner: 'Loading indicator component',
  stacks: 'Layout stack components',
  switch: 'Toggle switch components',
  tabs: 'Tabbed interface components',
  'tamagui-image': 'Enhanced image component',
  text: 'Text display component',
  toast: 'Notification component',
  'toggle-group': 'Group of toggle buttons',
  tooltip: 'Informational tooltips',
  unspaced: 'Remove spacing utilities',
  'visually-hidden': 'Hide content visually while keeping it accessible',
}

// core docs mappings
const coreDocs = [
  ['animations', 'Animation system and utilities'],
  ['config-v4', 'Version 4 configuration guide'],
  ['configuration', 'General configuration options'],
  ['exports', 'Available exports and utilities'],
  ['font-language', 'Font and language settings'],
  ['stack-and-text', 'Basic layout components'],
  ['styled', 'Styled component system'],
  ['theme', 'Theming system'],
  ['tokens', 'Design tokens and variables'],
  ['use-media', 'Media query hooks'],
  ['use-theme', 'Theme hooks'],
  ['variants', 'Component variants system'],
]

// intro/compiler docs
const compilerDocs = [
  ['compiler-install', 'How to install and setup the compiler'],
  ['why-a-compiler', 'Benefits and reasoning behind the compiler'],
  ['benchmarks', 'Performance benchmarks and comparisons'],
]

// cache for llms.txt
let llmsTxtCache = {
  content: '',
  etag: '',
}

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function pascalCase(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function generateLlmsTxt() {
  if (llmsTxtCache.content) {
    return llmsTxtCache
  }

  const componentsDir = path.join(process.cwd(), 'data/docs/components')
  let components: string[] = []

  try {
    components = fs
      .readdirSync(componentsDir)
      .filter((item) => {
        const fullPath = path.join(componentsDir, item)
        return fs.statSync(fullPath).isDirectory()
      })
      .sort()
  } catch (err) {
    console.error('Error reading components directory:', err)
  }

  let content = `# Tamagui Documentation

If you want all docs as a single document, see https://tamagui.dev/llms-full.txt.

> Tamagui is a complete UI solution for React Native and Web, with a fully-featured UI kit, styling engine, and optimizing compiler.

This documentation covers all aspects of using Tamagui, from installation to advanced usage.

## Core

Core documentation covers the fundamental styling and configuration aspects of Tamagui:

`

  for (const [slug, desc] of coreDocs) {
    content += `- [${titleCase(slug)}](https://tamagui.dev/docs/core/${slug}.md): ${desc}\n`
  }

  content += `
## Compiler

Documentation about Tamagui's optimizing compiler:

`

  for (const [slug, desc] of compilerDocs) {
    content += `- [${titleCase(slug)}](https://tamagui.dev/docs/intro/${slug}.md): ${desc}\n`
  }

  content += `
## Components

All component documentation can be accessed at https://tamagui.dev/ui/[component-name]

Available components:
`

  for (const component of components) {
    const desc = componentDescriptions[component] || 'Component documentation'
    content += `- [${pascalCase(component)}](https://tamagui.dev/ui/${component}.md): ${desc}\n`
  }

  llmsTxtCache.content = content
  llmsTxtCache.etag = crypto.createHash('md5').update(content).digest('hex')

  return llmsTxtCache
}

export default apiRoute(async (request) => {
  const cache = generateLlmsTxt()
  const ifNoneMatch = request.headers.get('if-none-match')

  if (ifNoneMatch === cache.etag) {
    return new Response(null, { status: 304 })
  }

  return new Response(cache.content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      ETag: cache.etag,
    },
  })
})
