export const docsRoutes = [
  {
    label: 'Getting Started',
    pages: [
      { title: 'Introduction', route: '/docs/intro/introduction' },
      { title: 'Installation', route: '/docs/intro/installation' },
      { title: 'Configuration', route: '/docs/intro/configuration' },
      { title: 'Themes', route: '/docs/intro/themes' },
      { title: 'Props', route: '/docs/intro/props' },
      { title: 'Benchmarks', route: '/docs/intro/benchmarks' },
      { title: 'Releases', route: 'https://github.com/tamagui/tamagui/releases' },
    ],
  },

  {
    label: 'Core',
    pages: [
      { title: 'styled', route: '/docs/core/styled' },
      { title: 'Stack & Text', route: '/docs/core/stack-and-text' },
      { title: 'Theme', route: '/docs/core/theme' },
      { title: 'useMedia', route: '/docs/core/use-media' },
      { title: 'useTheme', route: '/docs/core/use-theme' },
    ],
  },

  {
    label: 'Tamagui',
    pages: [
      { title: 'Stacks', route: '/docs/components/stacks' },
      { title: 'Paragraph', route: '/docs/components/text' },
      { title: 'Button', route: '/docs/components/button' },
      { title: 'Headings', route: '/docs/components/headings' },
      { title: 'Image', route: '/docs/components/image' },
      { title: 'Forms', route: '/docs/components/forms' },
      { title: 'Separator', route: '/docs/components/separator' },
      { title: 'Popover', route: '/docs/components/popover' },
      { title: 'HoverablePopover', route: '/docs/components/hoverable-popover' },
      { title: 'Tooltip', route: '/docs/components/tooltip' },
      { title: 'LinearGradient', route: '/docs/components/linear-gradient' },
      { title: 'VisuallyHidden', route: '/docs/components/visually-hidden' },
    ],
  },

  {
    label: 'Extra',
    pages: [{ title: 'Drawer', route: '/docs/components/drawer' }],
  },

  {
    label: 'Guides',
    pages: [
      { title: 'Design Systems', route: '/docs/guides/design-systems' },
      { title: 'Next.js', route: '/docs/guides/next-js' },
      { title: 'Expo', route: '/docs/guides/expo' },
    ],
  },
]

export const allDocsRoutes = docsRoutes.flatMap((x) => x.pages)
