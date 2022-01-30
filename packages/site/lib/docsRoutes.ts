export const docsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      { title: 'Introduction', slug: 'docs/intro/introduction' },
      { title: 'Installation', slug: 'docs/intro/installation' },
      { title: 'Configuration', slug: 'docs/intro/configuration' },
      { title: 'Themes', slug: 'docs/intro/themes' },
      { title: 'Props', slug: 'docs/intro/props' },
      { title: 'Benchmarks', slug: 'docs/intro/benchmarks' },
      { title: 'Releases', slug: 'docs/intro/releases' },
    ],
  },

  {
    label: 'Tamagui',
    pages: [
      { title: 'Stacks', slug: 'docs/components/stacks' },
      { title: 'Text', slug: 'docs/components/text' },
      { title: 'Button', slug: 'docs/components/button' },
      { title: 'Linear Gradient', slug: 'docs/components/linear-gradient' },
      { title: 'Headings', slug: 'docs/components/headings' },
      { title: 'Visually Hidden', slug: 'docs/components/visually-hidden' },
      { title: 'Forms', slug: 'docs/components/forms' },
      // { title: 'Popover', slug: 'docs/components/popover', pending: true },
      // { title: 'Tooltip', slug: 'docs/components/tooltip', pending: true },
      // { title: 'Grid', slug: 'docs/components/grid' },
    ],
  },

  {
    label: 'Core',
    pages: [
      { title: 'styled', slug: 'docs/core/styled' },
      { title: 'Stack & Text', slug: 'docs/core/stack-and-text' },
      { title: 'Theme', slug: 'docs/core/theme' },
      { title: 'useMedia', slug: 'docs/core/use-media' },
      { title: 'useTheme', slug: 'docs/core/use-theme' },
    ],
  },

  {
    label: 'Guides',
    pages: [
      { title: 'Design Systems', slug: 'docs/guides/design-systems' },
      { title: 'Next.js', slug: 'docs/guides/next-js' },
      { title: 'Expo', slug: 'docs/guides/expo' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages)
